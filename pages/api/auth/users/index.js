import factory from '../../../../controllers/handler-factory'
import User from '../../../../models/user-model'

import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'
import catchAsync from '../../../../lib/catch-async'

const handler = async (req, res) => {
	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getAll(req, res, User)
			break

		case 'POST':
			await factory.createOne(req, res, User)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default catchAsync(handler)
