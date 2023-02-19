import { forgotPassword } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'
import catchAsync from '../../../../lib/catch-async'

const handler = async (req, res) => {
	const { method } = req
	
	if (method === 'PATCH') {
		await forgotPassword(req, res)
	}

	sendMethodNotAllowedResponse(res, method)
}

export default catchAsync(handler)
