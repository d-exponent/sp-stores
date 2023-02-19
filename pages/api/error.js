import errorModel from '../../models/error-model'
import factory from '../../controllers/handler-factory'
import { sendMethodNotAllowedResponse } from '../../lib/controller-utils'
import catchAsync from '../../lib/catch-async'

const handler = async (req, res) => {
	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getAll(req, res, errorModel)
			break
		case 'POST':
			await factory.createOne(req, res, errorModel)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default catchAsync(handler)
