import errorModel from '../../models/error-model'
import factory from '../../controllers/handler-factory'
import { sendMethodNotAllowedResponse } from '../../lib/controller-utils'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return sendMethodNotAllowedResponse(res, req.method)
	}

	await factory.createOne(req, res, errorModel)

}

export default handler
