import catchAsync from '../../../../lib/catch-async'
import { resetPassword } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'

const handler = async (req, res) => {
	
	switch (req.method) {
		case 'PATCH':
			await resetPassword(req, res)
			break

		default:
			sendMethodNotAllowedResponse(res, req.method)
			break
	}
}

export default catchAsync(handler)
