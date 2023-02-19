import { verifyPayment } from '../../../controllers/paystack-controller'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'
import catchAsync from '../../../lib/catch-async'

const handler = async (req, res) => {
	if (req.method === 'POST') {
		await verifyPayment(req, res)
	}

	sendMethodNotAllowedResponse(res, req.method)
}

export default catchAsync(handler)
