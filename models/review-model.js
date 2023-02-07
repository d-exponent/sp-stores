import mongoose from 'mongoose'

import Product from './product-model'
import { isValidEmail } from '../lib/utils'
import { modelVirtualsConfiq } from '../lib/db-utils'

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
		productId: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: [true, 'A review must be for a product'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'A review must have at least one rating']
		},
		review: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
		modifiedAt: Date,
	},
	modelVirtualsConfiq
)

reviewSchema.statics.calculateRatingsStats = async function (itemId) {
	
	const id = typeof itemId === 'string' ? new mongoose.Types.ObjectId(itemId) : itemId

	const ratingStats = await this.aggregate([
		{ $match: { productId: id } },
		{
			$group: {
				_id: '$productId',
				numOfReviewDocuments: { $sum: 1 },
				averageRating: { $avg: '$rating' },
			},
		},
	])

	const hasNewStats = ratingStats.length > 0

	const updatedStats = {
		totalRatings: hasNewStats ? ratingStats[0].numOfReviewDocuments : 0,
		ratingsAverage: hasNewStats ? Math.round(ratingStats[0].averageRating) : 4,
	}

	// Update the product
	await Product.findByIdAndUpdate(itemId, updatedStats)
}

reviewSchema.index({ customerEmail: 1, productId: -1 }, { unique: true })

reviewSchema.post('save', async function () {
	await this.constructor.calculateRatingsStats(this.productId)
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
	await this.r.constructor.calculateRatingsStats(this.r.productId)
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
