import mongoose from 'mongoose'

import Product from './product-model'
import { isValidEmail } from '../lib/utils'

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
		statics: {
			async calculateRatinsStats(productId) {
				//calcultate stats for the reviews on a product and update the product
				const ratingStats = await this.aggregate([
					{ $match: { product: new mongoose.Types.ObjectId(productId) } },
					{
						$group: {
							_id: '$product',
							numOfRatings: { $sum: 1 },
							averageRating: { $avg: '$rating' },
						},
					},
				])

				const hasNewStats = ratingStats.length > 0

				await Product.findByIdAndUpdate(productId, {
					ratingsAverage: hasNewStats ? ratingStats[0].averageRating : 4,
					totalRatings: hasNewStats ? ratingStats[0].numOfRatings : 0,
				})

				//End of calculateRatinsStats
			},
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

// reviewSchema.index({ customerEmail: 1, product: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.modifiedAt = Date.now()
	next()
})

/**
 * ERROR: For some reason we can't run calculateRatinsStats via middlewares
 * Workaroud will be implemented in the handler factory controllers
 */

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
