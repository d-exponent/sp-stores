import mongoose from 'mongoose'
import Product from './product-model'
import User from './user-model'

const reviewSchema = new mongoose.Schema(
	{
		customer: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'A review must be from a customer'],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
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
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

reviewSchema.index({ product: 1, customer: -1 }, { unique: true })

reviewSchema.pre('save', function (next) {
	// So we don't have to worry about coverting data type to number from a form
	this.ratings = +this.ratings
	next()
})

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v')

	this.populate({
		path: 'product',
		select: 'name',
	}).populate({
		path: 'customer',
		select: 'firstName lastName',
	})
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
				averageRating: { $avg: '$ratings' },
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
}

reviewSchema.post('save', function () {
	this.constructor.handleRatingStats(this.product)
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
