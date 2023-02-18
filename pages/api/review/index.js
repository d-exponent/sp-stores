import factory from '../../../controllers/handler-factory'
import Review from '../../../models/review-model'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'
import catchAsync from '../../../middlewares/catch-async'

const handler = async (req, res) => {
	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getAll(req, res, Review)
			break
		case 'POST':
			await factory.createOne(req, res, Review)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default catchAsync(handler)
