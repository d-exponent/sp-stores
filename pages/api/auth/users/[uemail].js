import { getUser } from '../../../../controllers/user-controller'
import { updatePassword } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'
import catchAsync from '../../../../middlewares/catch-async'

const handler = async (req, res) => {
	const { method } = req

	switch (method) {
		case 'GET':
			await catchAsync(req, res, getUser)
			break

		case 'PATCH':
			await catchAsync(req, res, updatePassword)
			break

		default:
			sendMethodNotAllowedResponse(res, method)
			break
	}
}

export default handler
