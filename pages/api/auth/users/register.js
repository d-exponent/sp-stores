import { createUser } from '../../../../controllers/auth-controller'
import catchAsync from '../../../../lib/catch-async'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'

const handler = async (req, res) => {
	if (req.method === 'POST') {
		await createUser(req, res)
	}

	sendMethodNotAllowedResponse(res, req.method)
}

export default catchAsync(handler)
