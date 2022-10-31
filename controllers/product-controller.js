import Product from '../models/product-model'
import catchAsync from '../middlewares/catch-async'
import AppError from '../lib/app-error'

import { dbConnect, setProductToSchema } from '../lib/db-utils'
import { responseSender } from '../lib/controller-utils'

export const getAllProducts = catchAsync(async (req, res) => {
	
	await dbConnect()
	const allProducts = await Product.find({}).sort({ uploadedAt: -1 })

	if (!allProducts) {
		throw new AppError('Could not find any products', 404)
	}

	responseSender(res, 200, {
		success: true,
		data: allProducts,
	})
})

export const getProduct = catchAsync(async (req, res) => {
	const { slug } = req.query

	await dbConnect()
	const product = await Product.findOne({ slug })

	if (!product) {
		throw new AppError('Could not find product', 404)
	}

	responseSender(res, 200, {
		success: true,
		data: product,
	})
})

export const createProduct = catchAsync(async (req, res) => {
	if (!req.body) {
		throw new AppError('Please provide product information', 400)
	}

	const productObj = { ...req.body }
	const filtered = setProductToSchema(productObj)

	if (req.files.imageCover) {
		filtered.imageCover = req.files.imageCover
	}

	if (req.files.images) {
		filtered.images = req.files.images
	}

	await dbConnect()
	const newProduct = await Product.create(filtered)

	responseSender(res, 201, {
		success: true,
		data: newProduct,
	})
})

export const updateProduct = catchAsync(async (req, res) => {
	const { slug } = req.query

	const optionsConfig = {
		new: true,
		runValidators: true,
	}

	await dbConnect()
	const product = await Product.findOneAndUpdate({ slug }, req.body, optionsConfig)

	responseSender(res, 200, { success: true, data: product })
})
