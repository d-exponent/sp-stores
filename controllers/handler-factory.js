import catchAsync from '../middlewares/catch-async'
import { sendResponse } from '../lib/controller-utils'


const setIdOnQuery = (req, routeQueryId) => {

	req.query.id = req.query[routeQueryId]
	return req
}

const setTrueFromStringToBoolean = (query) => {

	if (!query) return {}

	let entries = Object.entries(query)

	if (entries.length === 0) return {}

	entries.forEach((entry) => {
		const [key, value] = entry

		if (value === 'true') {
			query[key] = true
		}
	})

	return Object.fromEntries(entries)
}


const getAll = async (req, res, Model, populateOption) => {

	const innerHandler = async (req, res) => {
		const query = setTrueFromStringToBoolean(req.query)

		let allQueriedDocuments = Model.find(query)

		if (populateOption) {
			allQueriedDocuments = allQueriedDocuments.populate(populateOption)
		}

		const allDocuments = await allQueriedDocuments

		sendResponse(res, 200, {
			success: true,
			results: allDocuments.length,
			data: allDocuments,
		})
	}

	await catchAsync(req, res, innerHandler)
}

const getOne = async (req, res, Model, populateOption) => {

	const innerHandler = async (req, res) => {
		let query = Model.findById(req.query.id)

		if (populateOption) {
			query = query.populate(populateOption)
		}

		const queriedDocument = await query

		sendResponse(res, 200, {
			success: true,
			data: queriedDocument,
		})
	}

	await catchAsync(req, res, innerHandler)
}

const createOne = async (req, res, Model) => {

	const innerHandler = async (req, res) => {
		const newDocument = await Model.create(req.body)

		sendResponse(res, 201, {
			success: true,
			data: newDocument,
		})
	}

	await catchAsync(req, res, innerHandler)
}

const updateOne = async (req, res, Model) => {

	console.log('Handler Factory Update One 🧰', req.body)

	const innerHandler = async (req, res) => {
		const updateConfig = {
			new: true,
			runValidators: true
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

	await catchAsync(req, res, innerHandler)
}

const deleteOne = async (req, res, Model) => {
	
	const innerHandler = async (req, res) => {
		await Model.findByIdAndDelete(req.query.id)
		res.status(204).send('Deleted')
	}
	
	await catchAsync(req, res, innerHandler)
}

const factory = {
	deleteOne,
	updateOne,
	getOne,
	getAll,
	createOne,
	setId: setIdOnQuery,
	setTrueToBoolean: setTrueFromStringToBoolean,
}

export default factory
