import catchAsync from '../../../../lib/catch-async'
import { resetPassword } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'

const handler = async (req, res) => {
	if (req.method === 'PATCH') {
		await resetPassword(req, res)
	}

	sendMethodNotAllowedResponse(res, req.method)
}

export default catchAsync(handler)
