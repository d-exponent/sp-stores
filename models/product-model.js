import mongoose from 'mongoose'
import slugify from 'slugify'

import { formatToCurrency } from '../lib/utils'

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
			enum: ['clothing', 'footwares', 'accessories'],
			required: [true, 'A product must have a category'],
		},
		color: {
			type: String,
			required: [true, 'A product must have a color'],
			lowercase: true,
		},
		description: {
			required: [true, 'A product must have a description'],
			type: String,
			minLength: [20, 'A product description must have at least 20 characters'],
		},
		discountPercentage: Number,
		discountPrice: {
			type: Number,
			validate: {
				validator: function (value) {
					return this.price > value
				},
				message: 'A discount price must be less than the product price.',
			},
			default: 0,
		},
		quantity: {
			type: Number,
			default: 0,
			required: [true, 'A product must have at least one item'],
		},
		imageCover: String,
		images: [String],
		inStock: {
			type: Boolean,
			default: true,
		},
		totalRatings: Number,
		ratingsAverage: Number,
		ratingsTotal: Number,
		salesCategory: String,
		sizes: [{ type: String, lowercase: true }],
		slug: String,
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
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)
productSchema.index({ slug: 1 }, { unique: true })

productSchema.virtual('priceAsCurrency').get(function () {
	return formatToCurrency(this.price)
})

productSchema.virtual('discountPriceAsCurrency').get(function () {
	return formatToCurrency(this.discountPrice)
})


// Create/Save Middlewares
productSchema.pre('save', function (next) {
	if (this.discountPrice) {
		const percentage = (this.discountPrice / this.price) * 100
		this.discountPercentage = 100 - Math.round(percentage)
	}

	next()
})

// AUTO GENERATE SLUG PRE-SAVE MIDDLEWARE
productSchema.pre('save', function (next) {
	const millisecondsToStringArr = Date.now().toString().split('')
	const lastFiveChar = millisecondsToStringArr.splice(8).join('')

	const slugString = `${this.brand} ${this.name} ${lastFiveChar}`
	this.slug = slugify(slugString, { lower: true })
	next()
})

// Query Middlewares
productSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

// findOneAndUpdate, findOneAndDelete ......
productSchema.pre(/^findOneAnd/, function (next) {
	if (this.quantity === 0) {
		this.inStock = false
	}

	next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
