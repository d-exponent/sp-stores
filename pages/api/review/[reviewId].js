import Review from '../../../models/review-model'
import factory from '../../../controllers/handler-factory'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'
import catchAsync from '../../../lib/catch-async'


const handler = async (req, res) => {
	req = factory.setId(req, 'reviewId')

	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getOne(req, res, Review)
			break

		case 'PATCH':
			await factory.updateOne(req, res, Review)
			break

		case 'DELETE':
			await factory.deleteOne(req, res, Review)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default catchAsync(handler)