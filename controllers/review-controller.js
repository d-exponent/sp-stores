import Review from '../models/review-model'
import throwOperationalError from '../lib/app-error'
import { sendResponse } from '../lib/controller-utils'

export const createReview = async (req, res) => {
	const review = await Review.create(req.body)

	sendResponse(res, 201, {
		success: true,
		data: review,
	})
}

export const getReviews = async (req, res) => {
	const reviews = await Review.find({})

	if (!reviews) {
		throwOperationalError('No documents were found', 404)
	}

	sendResponse(res, 200, {
		success: true,
		data: reviews,
	})
}

export const getReviewById = async (req, res) => {
	const review = await Review.findById(req.query.reviewId)

	sendResponse(res, 200, {
		success: true,
		data: review,
	})
}
