import mongoose from 'mongoose'
import slugify from 'slugify'
import reviewModel from './review-model'

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
					return this.price > value && value > -1
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
		salesCategory: String,
		sizes: [
			{
				type: String,
				lowercase: true,
			},
		],
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
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

productSchema.virtual('priceAsCurrency').get(function () {
	return formatToCurrency(this.price)
})

productSchema.virtual('discountPriceAsCurrency').get(function () {
	return formatToCurrency(this.discountPrice)
})

productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'product',
	localField: '_id',
})



//Set initial quantity
productSchema.pre('save', function (next) {
	// Handle discount price changes
	if (this.discountPrice) {
		const percentage = (this.discountPrice / this.price) * 100
		this.discountPercentage = 100 - Math.round(percentage)
	}

	// Handle inStock Boolean

	this.inStock = this.quantity > 0

	this.initialQuantity = this.quantity
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

// Show date of lastModified
productSchema.pre(/^findOneAnd/, function (next) {
	// Handle discount price changes
	if (this.discountPrice) {
		const percentage = (this.discountPrice / this.price) * 100
		this.discountPercentage = 100 - Math.round(percentage)
	}

	this.inStock = this.quantity > 0

	
	this.lastModifiedAt = Date.now()
	next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
