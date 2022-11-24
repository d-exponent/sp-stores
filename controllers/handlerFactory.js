import { sendResponse } from '../lib/controller-utils'

export const deleteItem = (Model) => {
	return async (req, res) => {
		const urlParts = req.originalUrl.split('/')
		const id = urlParts[urlParts.length - 1]

		await Model.findByIdAndDelete(id)

		sendResponse(res, 204, { success: true, data: null })
	}
}
