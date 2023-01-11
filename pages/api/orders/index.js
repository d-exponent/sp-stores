import Order from '../../../models/order-model'
import factory from '../../../controllers/handler-factory'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'

const handler = async (req, res) => {
	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getAll(req, res, Order)
			break

		case 'POST':
			await factory.createOne(req, res, Order)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default handler
