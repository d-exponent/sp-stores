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
			async calculateRatingsStats(productId) {
				const id =
					typeof productId === 'string'
						? new mongoose.Types.ObjectId(productId)
						: productId

				//calcultate stats for the reviews on a product and update the product
				const ratingStats = await this.aggregate([
					{ $match: { product: id } },
					{
						$group: {
							_id: '$product',
							numOfRatingsDoc: { $sum: 1 },
							averageRating: { $avg: '$rating' },
						},
					},
				])

				const hasNewStats = ratingStats.length > 0

				const updatedBody = {
					// Set to default values if aggregate returns a falsy value
					totalRatings: hasNewStats ? ratingStats[0].numOfRatingsDoc : 0,
					ratingsAverage: hasNewStats ? Math.round(ratingStats[0].averageRating) : 4,
				}

				await Product.findByIdAndUpdate(productId, updatedBody, { new: true })
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

reviewSchema.post('save', async function () {
	await this.constructor.calculateRatingsStats(this.product)
})

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.modifiedAt = Date.now()

	this.r = await this.findOne().clone()
	next()
})

reviewSchema.post(/^findOneAnd/, async function () {
	await this.r.constructor.calculateRatingsStats(this.r.product)
})

/**
 * ERROR: For some reason we can't run calculateRatinsStats via middlewares
 * Workaroud will be implemented in the handler factory controllers
 */

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
