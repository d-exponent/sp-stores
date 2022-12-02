import Product from '../models/product-model'
import throwOperationalError from '../lib/app-error'
import { sendResponse, filterProductUpload } from '../lib/controller-utils'

export const createProduct = async (req, res) => {
	if (!req.body) {
		throwOperationalError('Please provide product information', 400)
	}

	const filtered = filterProductUpload(req.body)

	if (req.files.imageCover) {
		filtered.imageCover = req.files.imageCover
	}

	if (req.files.images) {
		filtered.images = req.files.images
	}

	const newProduct = await Product.create(filtered)

	sendResponse(res, 201, {
		success: true,
		data: newProduct,
	})
}

export const getAllProductsInStock = async (req, res) => {
	const allProducts = await Product.find({ inStock: true }).sort({ uploadedAt: -1 })

	if (!allProducts) {
		throwOperationalError('Could not find any products', 404)
	}

	sendResponse(res, 200, {
		success: true,
		results: allProducts.length,
		data: allProducts,
	})
}

export const getProduct = async (req, res) => {
	const { slug } = req.query

	const product = await Product.findOne({ slug }).populate('reviews')

	if (!product) {
		throwOperationalError('Could not find product', 404)
	}

	sendResponse(res, 200, {
		success: true,
		data: product,
	})
}

export const updateProduct = async (req, res) => {
	const { slug } = req.query

	const product = await Product.findOneAndUpdate({ slug }, req.body, {
		new: true,
		runValidators: true,
	})

	sendResponse(res, 200, { success: true, data: product })
}
