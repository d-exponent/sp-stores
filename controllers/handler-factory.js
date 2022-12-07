import { sendResponse } from '../lib/controller-utils'
import throwOperationalError from '../lib/app-error'
import Product from '../models/product-model'

const throwNotFoundError = (msg = 'Not Found') => {
	throwOperationalError(msg, 404)
}

const setId = (itemId) => (req, res, next) => {
	req.query.id = req.query[itemId]
	next()
}

const getModel = (arr) => arr[0]

const createOne = (...args) => {
	const Model = getModel(args)
	return async (req, res) => {
		const doc = await Model.create(req.body)

		if (args[1] && args[1] === 'calculateRatinsStats') {
			await Model.calculateRatinsStats(doc.product)

			console.log('Calculating stats🤖🤖🧰')
		}

		sendResponse(res, 201, {
			success: true,
			data: doc,
		})
	}
}

const getAll = (...args) => {
	const Model = getModel(args)
	return async (req, res) => {
		const query = { ...req.query }

		Object.entries(query).forEach((entry) => {
			const [key, value] = entry

			if (value === 'true') {
				query[key] = true
			}
		})

		const docs = await Model.find(query)

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

const getOne = (...args) => {
	//
	const Model = getModel(args)
	const populate = args[1] ? args[1] : null

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

const updateOne = (...args) => {
	const Model = getModel(args)

	return async (req, res) => {
		const updatedItem = await Model.findByIdAndUpdate(req.query.id, req.body, {
			new: true,
			runValidators: true,
		})

		if (args[1] && args[1] === 'calculateRatinsStats') {
			await Model.calculateRatinsStats(updatedItem.product)
		}

		if (!updatedItem) {
			throwNotFoundError('Could not update the document')
		}

		sendResponse(res, 200, {
			success: true,
			data: updatedItem,
		})
	}
}

const deleteOne = (...args) => {
	const Model = getModel(args)

	return async (req, res) => {
		Model.findByIdAndDelete(req.query.id).then(()=>{}).catch()

		if (args[1] && args[1] === 'calculateRatinsStats') {
			const toUpdate = await Product.findById(req.query.productId)

			await Model.calculateRatinsStats(toUpdate._id)
		}

		res.status(204)
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
