import Order from '../../../models/order-model'
import factory from '../../../controllers/handler-factory'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'

const handler = async (req, res) => {
	req = factory.setId(req, 'orderId')

	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getOne(req, res, Order)
			break

		case 'PATCH':
			await factory.updateOne(req, res, Order)
			break

		case 'DELETE':
			await factory.deleteOne(req, res, Order)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default handler
