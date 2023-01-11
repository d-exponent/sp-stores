import { createUser } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'
import catchAsync from '../../../../middlewares/catch-async'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return sendMethodNotAllowedResponse(res, req.method)
	}

	await catchAsync(req, res, createUser)
}

export default handler
