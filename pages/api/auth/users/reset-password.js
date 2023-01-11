import { resetPassword } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'

const handler = async (req, res) => {
	if (req.method === 'PATCH') {
		await catchAsync(req, res, resetPassword)
	}

	sendMethodNotAllowedResponse(res, req.method)
}

export default handler
