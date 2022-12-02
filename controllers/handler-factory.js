import { sendResponse } from '../lib/controller-utils'
import throwOperationalError from '../lib/app-error'

const setItemIdToQuery = (req, res, next) => {
	const urlParts = req.url.split('/')
	const id = urlParts[urlParts.length - 1]

	req.query.itemId = id

	next()
}

const throwNotFoundError = (msg) => {
	throwOperationalError(msg || 'Not found', 404)
}

const getAllItems = (Model) => {
	return async (req, res) => {
		const items = await Model.find({})

		const isEmptyItems = items.length <= 0 || !items

		if (isEmptyItems) throwNotFoundError()

		sendResponse(res, 200, {
			success: true,
			results: items.length,
			data: items,
		})
	}
}

const createItem = (Model, options) => {
	return async (req, res) => {
		const item = await Model.create(req.body)

		const response = { success: true }

		if (options.returnItem) {
			response.data = item
		}

		sendResponse(res, 201, response)
	}
}

const deleteItem = (Model) => {
	return async (req, res) => {

		await Model.findByIdAndDelete(req.query.itemId)

		sendResponse(res, 204, {
			success: true,
			data: null,
		})
	}
}

const getItem = (Model) => {
	return async (req, res) => {
		const item = await Model.findById(req.query.itemId)

		if (!item) throwNotFoundError()

		sendResponse(res, 200, {
			success: true,
			data: item,
		})
	}
}

const updateItem = (Model, queryOptions) => {
	return async (req, res) => {
		const updatedItem = await Model.findByIdAndUpdate(
			req.query.ItemId,
			req.body,
			queryOptions
		)

		if (!updatedItem) {
			throwNotFoundError()
		}

		sendResponse(res, 200, {
			success: true,
			data: updatedItem,
		})
	}
}

const factory = {
	deleteOne: deleteItem,
	updateOne: updateItem,
	getOne: getItem,
	getAll: getAllItems,
	createOne: createItem,
	middlewares: {
		setItemIdToQuery,
	},
}

export default factory
