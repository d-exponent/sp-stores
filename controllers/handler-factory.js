import { sendResponse } from '../lib/controller-utils'
import throwOperationalError from '../lib/app-error'

const throwNotFoundError = (msg = 'Not Found') => {
	throwOperationalError(msg, 404)
}

const setId = (itemId) => {
	return (req, res, next) => {
		req.query.id = req.query[itemId]
		next()
	}
}

const createOne = (Model) => {
	return async (req, res) => {
		const doc = await Model.create(req.body)

		sendResponse(res, 201, {
			success: true,
			data: doc,
		})
	}
}

const getAll = (Model) => {
	return async (req, res) => {
		const docs = await Model.find(req.query)

		const isEmptyItems = docs.length === 0 || !docs

		if (isEmptyItems) {
			throwNotFoundError('Could not find any documents')
		}

		sendResponse(res, 200, {
			success: true,
			results: docs.length,
			data: docs,
		})
	}
}

const getOne = (Model, populate) => {
	return async (req, res) => {
		let doc
		if (populate) {
			doc = await Model.findById(req.query.id).populate(populate)
		} else {
			doc = await Model.findById(req.query.id)
		}

		if (!doc) throwNotFoundError()

		sendResponse(res, 200, {
			success: true,
			data: doc,
		})
	}
}

const updateOne = (Model) => {
	return async (req, res) => {
		const updatedItem = await Model.findByIdAndUpdate(req.query.id, req.body, {
			new: true,
			runValidators: true,
		})

		if (!updatedItem) {
			throwNotFoundError('Could not update  the document')
		}

		sendResponse(res, 200, {
			success: true,
			data: updatedItem,
		})
	}
}

const deleteOne = (Model) => {
	return async (req, res) => {
		await Model.findByIdAndDelete(req.query.id)

		sendResponse(res, 204, null)
	}
}

const factory = {
	deleteOne,
	updateOne,
	getOne,
	getAll,
	createOne,
	setId,
}

export default factory
