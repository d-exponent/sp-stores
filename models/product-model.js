//        HELPERS
const setDiscountPercentage = (discountPrice, price) => {
	if (!discountPrice) return undefined

	const percentage = (discountPrice / price) * 100
	const discountPercentage = 100 - Math.round(percentage)

	return discountPercentage
}

const setInstock = (quantity) => {
	if (!quantity) return false

	return quantity > 0
}

import mongoose from 'mongoose'
import slugify from 'slugify'
import Review from './review-model'
import { modelVirtualsConfiq } from '../lib/db-utils'
import { getQuantityFromSizes } from '../lib/model-util'

const sizeSchema = new mongoose.Schema(
	{
		size: {
			type: String,
			lowercase: true,
			required: [true, 'Please provide a size'],
		},
		quantity: {
			type: Number,
			validate: {
				validator: (value) => value > 0,
				message: (props) => `${props.value} must be at least one (1)`,
			},
		},
	},
	{ _id: false }
)

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A product must have a name'],
			trim: true,
		},
		brand: {
			type: String,
			required: [true, 'A product must have a brand'],
			trim: true,
			lowercase: true,
		},
		category: {
			type: String,
			enum: {
				values: ['clothing', 'footwares', 'accessories'],
				message: (props) => `${props.value} is not a valid product category`,
			},
			required: [true, 'A product must have a category'],
		},
		color: {
			type: String,
			required: [true, 'A product must have a color'],
			lowercase: true,
		},
		discountPercentage: Number,
		discountPrice: {
			type: Number,
			validate: {
				validator: function (value) {
					return this.price > value && value > -1
				},
				message: 'A discount-price must be less than the price.',
			},
			default: 0,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		initialQuantity: {
			type: Number,
			select: false,
		},
		imageCover: {
			type: String,
			required: true,
		},
		images: [String],
		inStock: {
			type: Boolean,
			default: true,
		},
		lastModifiedAt: Date,
		totalRatings: {
			type: Number,
			default: 0,
		},
		ratingsAverage: {
			type: Number,
			default: 4,
		},
		sizes: [sizeSchema],
		slug: {
			type: String,
			unique: true,
		},
		price: {
			type: Number,
			required: [true, 'A product must have a price'],
		},
		productType: {
			type: String,
			required: [true, 'A product must belong to a type'],
			trim: true,
			lowercase: true,
		},
		uploadedAt: {
			type: Date,
			default: Date.now,
		},
	},
	modelVirtualsConfiq
)

productSchema.methods.replaceSizes = async function (sizesArr) {
	const filteredSizes =
		sizesArr?.length > 0 && sizesArr.filter((size) => size.quantity > 0)

	this.sizes = filteredSizes || []

	this.quantity = getQuantityFromSizes(filteredSizes)

	this.inStock = setInstock(this.quantity)

	this.lastModifiedAt = Date.now()
}

//   VIRTUALS
productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'productId',
	localField: '_id',
})

// DOCUMENT MIDDLEWARE

// Generate slug
productSchema.pre('save', function (next) {
	const nowInMillisecondsStr = Date.now().toString()
	const dateStringLength = nowInMillisecondsStr.length
	const lastFiveChar = nowInMillisecondsStr.slice(dateStringLength - 5)

	const slugString = `${this.brand} ${this.name} ${lastFiveChar}`
	this.slug = slugify(slugString, { lower: true })
	next()
})

//Ensure only unique sizes are saved in sorted Order
productSchema.pre('save', function (next) {
	const uniqueSizes = []

	// Remove duplicate objects by size
	const uniqueSizesObjects = this.sizes.filter(({ size }) => {
		const isInUniqueSizes = uniqueSizes.includes(size)

		if (isInUniqueSizes) return false

		uniqueSizes.push(size)
		return true
	})

	this.sizes = []

	uniqueSizes
		.sort((a, b) => a - b)
		.forEach((size) => {
			const sizeObject = uniqueSizesObjects.find((s) => s.size === size)

			this.sizes.push(sizeObject)
		})

	next()
})

// Ensure there are no size objects with quantity values equals zero
productSchema.pre('save', function (next) {
	this.sizes = this.sizes.filter((size) => size.quantity > 0)
	next()
})

// Set the Initial-Quantity and Quantity feilds values
productSchema.pre('save', function (next) {
	if (this.isNew) {
		this.initialQuantity = getQuantityFromSizes(this.sizes)
		this.quantity = this.initialQuantity
	}

	next()
})

//Set the instock and discount Percentage feilds values
productSchema.pre('save', function (next) {
	this.discountPercentage = setDiscountPercentage(this.discountPrice, this.price)

	this.inStock = this.quantity > 0

	next()
})

// QUERY MIDDLEWARES

// Remove __v feild from queries
productSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
