import { sendResponse } from '../lib/controller-utils'
import throwOperationalError from '../lib/app-error'

const getModelFromArgs = (arr) => arr[0]

const setIdOnQuery = (itemId) => (req, res, next) => {
	req.query.id = req.query[itemId]
	// delete req.query[itemId]
	next()
}

const getAll = (...args) => {
	const Model = getModelFromArgs(args)

	return async (req, res) => {
		const query = { ...req.query }

		Object.entries(query).forEach((entry) => {
			const [key, value] = entry

			if (value === 'true') {
				query[key] = true
			}
		})

		const docs = await Model.find(query)

		if (docs.length < 1) {
			throwOperationalError('Could not find any documents', 404)
		}

		sendResponse(res, 200, {
			success: true,
			results: docs.length,
			data: docs,
		})
	}
}

const getOne = (...args) => {
	const Model = getModelFromArgs(args)

	const populate = args[1] ? args[1] : null

	return async (req, res) => {
		let doc

		if (populate) {
			doc = await Model.findById(req.query.id).populate(populate)
		} else {
			doc = await Model.findById(req.query.id)
		}

		if (!doc) {
			throwOperationalError('Could not find the document', 404)
		}

		sendResponse(res, 200, {
			success: true,
			data: doc,
		})
	}
}

const createOne = (...args) => {
	const Model = getModelFromArgs(args)

	return async (req, res) => {
		const doc = await Model.create(req.body)

		sendResponse(res, 201, {
			success: true,
			data: doc,
		})
	}
}

const updateOne = (...args) => {
	const Model = getModelFromArgs(args)

	return async (req, res) => {
		const updatedItem = await Model.findByIdAndUpdate(req.query.id, req.body, {
			new: true,
			runValidators: true,
		})

		sendResponse(res, 200, {
			success: true,
			data: updatedItem,
		})
	}
}

const deleteOne = (...args) => {
	const Model = getModelFromArgs(args)

	return async (req, res) => {
		await Model.findByIdAndDelete(req.query.id)
		res.status(204).send('Deleted')
	}
}

const factory = {
	deleteOne,
	updateOne,
	getOne,
	getAll,
	createOne,
	setId: setIdOnQuery,
}

export default factory
