import Product from '../../../models/product-model'
import factory from '../../../controllers/handler-factory'
import { sendMethodNotAllowedResponse } from '../../../lib/controller-utils'
import catchAsync from '../../../lib/catch-async'

const handler = async (req, res) => {
	req = factory.setId(req, 'productId')

	const { method } = req

	switch (method) {
		case 'GET':
			await factory.getOne(req, res, Product, 'reviews')
			break

		case 'PATCH':
			await factory.updateOne(req, res, Product)
			break

		case 'DELETE':
			await factory.deleteOne(req, res, Product)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default catchAsync(handler)
