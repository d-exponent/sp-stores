import mongoose from 'mongoose'
import slugify from 'slugify'
import Review from './review-model'
import { modelVirtualsConfiq } from '../lib/db-utils'

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
				validator: (value) => value > -1,
				message: (props) => `${props.value} must be at least zero`,
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

// HELPERS
const setDiscountPercentage = (discountPrice, price) => {
	if (!discountPrice) return undefined

	const percentage = (discountPrice / price) * 100
	const discountPercentage = 100 - Math.round(percentage)

	return discountPercentage
}

const setInstock = (quantity) => quantity > 0

// MIDDLEWARE AND VIRTUALS
productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'productId',
	localField: '_id',
})

//Ensure only unique sizes are saved and in sorted Order
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

productSchema.pre('save', function (next) {
	const totalQuantity = this.sizes
		.map((size) => size.quantity)
		.reduce((sum, quantity) => sum + quantity)

	this.initialQuantity = totalQuantity
	this.quantity = totalQuantity

	next()
})

//Set initial quantity
productSchema.pre('save', function (next) {
	this.discountPercentage = setDiscountPercentage(this.discountPrice, this.price)

	this.inStock = setInstock(this.quantity)

	next()
})

// AUTO GENERATE SLUG ON SAVE
productSchema.pre('save', function (next) {
	const nowInMillisecondsStr = Date.now().toString()
	const dateStringLength = nowInMillisecondsStr.length
	const lastFiveChar = nowInMillisecondsStr.slice(dateStringLength - 5)

	const slugString = `${this.brand} ${this.name} ${lastFiveChar}`
	this.slug = slugify(slugString, { lower: true })
	next()
})

// Remove __v feild from queries
productSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

productSchema.pre(/^findOneAnd/, function (next) {
	this.discountPercentage = setDiscountPercentage(this.discountPrice, this.price)

	this.inStock = setInstock(this.quantity)

	this.lastModifiedAt = Date.now()
	next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
