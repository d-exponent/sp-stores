import { sendResponse } from '../lib/controller-utils'
import throwOperationalError from '../lib/app-error'

const setIdOnQuery = (itemId) => (req, res, next) => {
	req.query.id = req.query[itemId]

	next()
}

const getAll = (Model, populateOption) => {
	return async (req, res) => {

		// const query = { ...req.query }
		

		// Object.entries(query).forEach((entry) => {
		// 	const [key, value] = entry

		// 	if (value === 'true') {
		// 		query[key] = true
		// 	}
		// })

		let allQueriedDocuments = Model.find(req.query)

		if (populateOption) {
			allQueriedDocuments = allQueriedDocuments.populate(populateOption)
		}

		const allDocuments = await allQueriedDocuments

		// if (allDocuments.length < 1) {
		// 	throwOperationalError('Could not find any documents', 404)
		// }

		sendResponse(res, 200, {
			success: true,
			results: allDocuments.length,
			data: allDocuments,
		})
	}
}

const getOne = (Model, populateOption) => {
	return async (req, res) => {
		let query = Model.findById(req.query.id)

		if (populateOption) {
			query = query.populate(populateOption)
		}

		const queriedDocument = await query

		if (!queriedDocument) {
			throwOperationalError('Could not find the document', 404)
		}

		sendResponse(res, 200, {
			success: true,
			data: queriedDocument,
		})
	}
}

const createOne = (Model) => {
	return async (req, res) => {
		const newDocument = await Model.create(req.body)

		sendResponse(res, 201, {
			success: true,
			data: newDocument,
		})
	}
}

const updateOne = (Model) => {
	return async (req, res) => {
		const updateConfig = {
			new: true,
			runValidators: true,
		}
		
		const updatedDocument = await Model.findByIdAndUpdate(
			req.query.id,
			req.body,
			updateConfig
		)

		sendResponse(res, 200, {
			success: true,
			data: updatedDocument,
		})
	}
}

const deleteOne = (Model) => {
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
