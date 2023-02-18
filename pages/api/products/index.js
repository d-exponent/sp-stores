import nextConnect from 'next-connect'

import Product from '../../../models/product-model'
import factory from '../../../controllers/handler-factory'
import throwOperationalError from '../../../lib/app-error'
import { dbConnect } from '../../../lib/db-utils'
import { removeCommas } from '../../../lib/utils'
import {
	isProductionEnv,
	sendMethodNotAllowedResponse,
	sendResponse,
} from '../../../lib/controller-utils'

import imageUploadHandler from '../../../middlewares/multer'
import imageResizeHandler from '../../../middlewares/sharp'
import { sendProdError } from '../../../controllers/error-controller'

// UTILITY FUNCTION
const setFeildsDataType = (upload) => {
	const allowedFeilds = [
		'name',
		'brand',
		'category',
		'color',
		'productType',
		'discountPrice',
		'quantity',
		'imageCover',
		'images',
		'totalRatings',
		'ratingsAverage',
		'sizes',
		'price',
		'productType',
	]

	const filterd = {}

	Object.entries(upload).forEach((entry) => {
		let [key, value] = entry

		key = key.trim()

		if (!allowedFeilds.includes(key)) return

		switch (key) {
			case 'quantity':
				filterd[key] = +value
				break

			case 'price':
				filterd[key] = +removeCommas(value)
				break

			case 'discountPrice':
				filterd[key] = +removeCommas(value)
				break

			default:
				filterd[key] = value
				break
		}
	})

	return filterd
}

const setProductFeilds = (req, res, next) => {
	if (!req.body) {
		throwOperationalError('Please provide product information', 400)
	}

	const filtered = setFeildsDataType(req.body)

	if (req.files.imageCover) {
		filtered.imageCover = req.files.imageCover
	}

	if (req.files.images) {
		filtered.images = req.files.images
	}

	req.body = filtered

	next()
}

const getProducts = async (req, res) => {
	const query = factory.setTrueToBoolean(req.query)
	const products = await Product.find(query)

	sendResponse(res, 200, {
		success: true,
		results: products.length,
		data: products,
	})
}

const createProduct = async (req, res) => {
	const newProduct = await Product.create(req.body)

	sendResponse(res, 201, {
		success: true,
		data: newProduct,
	})
}

// HANDLER CONFIGURATION
const handler = nextConnect({
	onError: (err, _, res, next) => {
		isProductionEnv()
			? sendProdError(res, err)
			: sendResponse(res, err.status || 500, {
					success: false,
					message: err.message,
			  })

		next()
	},
	onNoMatch: (req, res) => {
		sendMethodNotAllowedResponse(res, req.method)
	},
})

handler.use(async (req, res, next) => {
	await dbConnect()
	next()
})

handler.get(getProducts)

handler
	.use(imageUploadHandler)
	.use(imageResizeHandler)
	.use(setProductFeilds)
	.post(createProduct)

// Disallow body parsing, consume as stream
export const config = {
	api: {
		bodyParser: false,
	},
}

export default handler
