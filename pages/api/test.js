import mongoose from 'mongoose'
import reviewModel from '../../models/review-model'
import { dbConnect } from '../../lib/db-utils'

const handler = async (req, res) => {
	const productId = req.query.id

	await dbConnect()

	let ratingsStats = await reviewModel.aggregate([
		{ $match: { product: new mongoose.Types.ObjectId(productId) } },
		{
			$group: {
				_id: '$product',
				totalRatings: { $sum: 1 },
				averageRating: { $avg: '$ratings' },
			},
		},
	])

	// ratingsStats = await reviewModel.find({ product: '637ebe49880992a8104c' })

	res.status(200).json({ data: ratingsStats })
}

export default handler
