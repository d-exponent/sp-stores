import { verifyPayment } from '../../../controllers/paystack-controller'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'
import catchAsync from '../../../middlewares/catch-async'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return sendMethodNotAllowedResponse(res, req.method)
	}

	await catchAsync(req, res, verifyPayment)
}

export default handler
