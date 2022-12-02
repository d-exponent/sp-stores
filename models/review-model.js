import mongoose from 'mongoose'
import Product from './product-model'
import User from './user-model'

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
			required: [true, 'A review must belong to a user email'],
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

reviewSchema.index({ product: 1, customer: -1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

//price discountPrice

reviewSchema.statics.handleRatingStats = async function (productId) {
	//Get all the reviews for the product and find the average
	const ratingsStats = await this.aggregate([
		{ $match: { product: new mongoose.Types.ObjectId(productId) } },
		{
			$group: {
				_id: '$product',
				sumOfRatings: { $sum: 1 },
				averageRating: { $avg: '$rating' },
			},
		},
	])

	if (!ratingsStats.length) {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: 4,
			totalRatings: 0,
		})
		return
	}

	await Product.findByIdAndUpdate(productId, {
		ratingsAverage: ratingsStats[0].averageRating,
		totalRatings: ratingsStats[0].sumOfRatings,
	})

	console.log("🧰👌")
}

reviewSchema.pre('save', function () {
	this.constructor.handleRatingStats(this.product)
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
