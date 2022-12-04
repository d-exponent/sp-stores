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
	const reviews = await Review.find(req.query)

	if (!reviews) {
		throwOperationalError('No documents were found', 404)
	}

	sendResponse(res, 200, {
		success: true,
		results: reviews.length,
		data: reviews,
	})
}

export const getReview = async (req, res) => {
	const review = await Review.findById(req.query)

	sendResponse(res, 200, {
		success: true,
		data: review,
	})
}
