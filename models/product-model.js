//        HELPERS
import mongoose from 'mongoose'
import slugify from 'slugify'
import Review from './review-model'
import { modelVirtualsConfiq } from '../lib/db-utils'

const setDiscountPercentage = (discountPrice, price) => {
	if (!discountPrice) return undefined

	const percentage = (discountPrice / price) * 100
	const discountPercentage = 100 - Math.round(percentage)

	return discountPercentage
}

export const getQuantityFromSizes = (sizes) => {
	if (!sizes || !Array.isArray(sizes) || sizes.length < 1) {
		throw new TypeError('sizes must be an array')
	}

	if (sizes.some((s) => !s.quantity || !s.size)) {
		throw new TypeError(
			'sizes must be an array of objects containing a size and a quantity feild'
		)
	}

	return sizes.map((size) => size.quantity).reduce((sum, total) => sum + total)
}

export const setInStock = (quantitiy) => quantitiy > 0

const sizeSchema = new mongoose.Schema(
	{
		size: {
			type: String,
			lowercase: true,
			required: [true, 'Please provide a size'],
		},
		quantity: Number,
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
		didRUnPreSaveOnUpdate: Boolean,
	},
	modelVirtualsConfiq
)

//   VIRTUALS
productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'productId',
	localField: '_id',
})

// DOCUMENT MIDDLEWARE

//Set discount Percentage
productSchema.pre('save', function (next) {
	this.discountPercentage = setDiscountPercentage(this.discountPrice, this.price)
	next()
})

// Generate slug
productSchema.pre('save', function (next) {
	if (this.isNew) {
		const nowInMillisecondsStr = Date.now().toString()
		const dateStringLength = nowInMillisecondsStr.length
		const lastFiveChar = nowInMillisecondsStr.slice(dateStringLength - 5)

		const slugString = `${this.brand} ${this.name} ${lastFiveChar}`
		this.slug = slugify(slugString, { lower: true })
	}
	next()
})

//Ensure only unique sizes are saved in sorted Order
productSchema.pre('save', function (next) {
	if (this.isNew) {
		const uniqueSizes = []

		// Remove duplicate
		const uniqueSizesObjects = this.sizes.filter(({ size }) => {
			const isInUniqueSizes = uniqueSizes.includes(size)

			if (isInUniqueSizes) return false

			uniqueSizes.push(size)
			return true
		})

		this.sizes = []

		//SORT
		uniqueSizes
			.sort((a, b) => a - b)
			.forEach((size) => {
				const sizeObject = uniqueSizesObjects.find((s) => s.size === size)
				this.sizes.push(sizeObject)
			})
	}

	next()
})

// Filter out sizes with no quanity, set sizes dependent feilds
productSchema.pre('save', function (next) {
	
	this.sizes = this.sizes.filter((s) => s.quantity > 0 && s.size !== '')

	this.quantity = getQuantityFromSizes(this.sizes)
	this.inStock = setInStock(this.quantity)

	next()
})

productSchema.pre('save', function (next) {
	if (this.isNew) {
		this.initialQuantity = this.quantity
	}

	next()
})

// QUERY MIDDLEWARE
productSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
