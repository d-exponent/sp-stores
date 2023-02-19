import { verifyPayment } from '../../../controllers/paystack-controller'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'
import catchAsync from '../../../lib/catch-async'

const handler = async (req, res) => {
	const { method } = req

	switch (method) {
		case 'POST':
			await verifyPayment(req, res)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default catchAsync(handler)
