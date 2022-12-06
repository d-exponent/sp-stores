import mongoose from 'mongoose'
import Product from './product-model'

import { isValidEmail, purify } from '../lib/utils'

const reviewSchema = new mongoose.Schema(
	{
		customerEmail: {
			type: String,
			lowercase: true,
			trim: true,
			required: [true, 'A review must belong to a user email'],
			validate: [isValidEmail, 'Please enter a valid email address'],
		},
		customerName: {
			type: String,
			required: [true, 'A user creating a review must have a name'],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: [true, 'A review must be for a product'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		review: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
		modifiedAt: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

// reviewSchema.index({ customerEmail: 1, product: 1 }, { unique: true })

reviewSchema.statics.calculateRatinsStats = async function (productId) {
	//Get all the reviews for the product and find the average

	const ratingsStats = purify(
		await this.aggregate([
			{ $match: { product: new mongoose.Types.ObjectId(productId) } },
			{
				$group: {
					_id: '$product',
					sumOfRatings: { $sum: 1 },
					averageRating: { $avg: '$rating' },
				},
			},
		])
	)

	//Set to default values
	if (!ratingsStats.length) {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: 4,
			totalRatings: 0,
		})
		return
	}

	// Use Modified stats
	await Product.findByIdAndUpdate(productId, {
		ratingsAverage: ratingsStats[0].averageRating,
		totalRatings: Math.round(ratingsStats[0].sumOfRatings),
	})
}

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

reviewSchema.pre('save', async function (next) {
	await this.constructor.calculateRatinsStats(this.product)
	next()
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.modifiedAt = Date.now()

	this.r = await this.findOne().clone()

	next()
})

reviewSchema.post(/^findOneAnd/, async function () {
	await this.r.constructor.calculateRatinsStats(this.r.product)
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
