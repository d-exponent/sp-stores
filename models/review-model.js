import mongoose from 'mongoose'
import User from './user-model'
import Product from './product-model'

const reviewSchema = new mongoose.Schema(
	{
		customer: {
			type: mongoose.Schema.ObjectId,
			ref: User,
			required: [true, 'A review must be from a customer'],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: Product,
			required: [true, 'A review must be for a product'],
		},
		ratings: {
			type: Number,
			min: 1,
			max: 5,
		},
		review: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

reviewSchema.index({ product: 1, customer: 1 }, { unique: true })

reviewSchema.statics.calculateProductRatingsStats = async function (productId) {
	//Get all the reviews for the product and find the average
	const ratingsStats = await this.aggregate([
		{ $match: { product: productId } },
		{
			$group: {
				_id: '$product',
				sumOfRatings: { $sum: 1 },
				averageRating: { $avg: '$ratings' },
			},
		},
	])

	if (ratingsStats.length > 0) {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: group.averageRating,
			ratingsTotal: group.sumOfRatings,
		})
	}

	//TODO: Find a way to run this function when a review is made
	//TODO: Consider edge cases, Consider error handling
}

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v')

	this.populate({
		path: 'product',
		select: 'name price discountPrice',
	}).populate({
		path: 'customer',
		select: 'firstName lastName email phoneNumber',
	})
	next()
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
