import Product from '../models/product-model'
import AppError from '../lib/app-error'
import { responseSender } from '../lib/controller-utils'

function setProductToSchema(obj) {
	const configArr = [
		'name',
		'description',
		'brand',
		'category',
		'productType',
		'price',
		'color',
		'quantity',
		'discountPrice',
		'sizes',
	]

	const config = {}

	//Set the data type of the product's value to match the Schema
	configArr.forEach((element) => {
		if (element === 'quantity') {
			// Convert value to Number data type
			return (config[element] = +obj[element])
		}

		if (element === 'sizes') {
			// Lets make sure of no duplicates
			const sizesArray = obj[element].split(',') //Split to an array
			const unique = [...new Set(sizesArray)] // Remove duplicates

			return (config[element] = unique)
		}

		if (element === 'price' || element === 'discountPrice') {
			const initialValue = obj[element]

			const valueFormatted = initialValue.replace(/,/g, '') //lets remove commas
			const finalValue = valueFormatted ? +valueFormatted : +initialValue //convert to Number

			return (config[element] = finalValue)
		}

		config[element] = obj[element]
	})

	return config
}

export const getAllProducts = async (req, res) => {
	const allProducts = await Product.find({}).sort({ uploadedAt: -1 })

	if (!allProducts) {
		throw new AppError('Could not find any products', 404)
	}

	responseSender(res, 200, {
		success: true,
		data: allProducts,
	})
}

export const getProduct = async (req, res) => {
	const { slug } = req.query

	const product = await Product.findOne({ slug })
	if (!product) {
		throw new AppError('Could not find product', 404)
	}

	responseSender(res, 200, {
		success: true,
		data: product,
	})
}

export const createProduct = async (req, res) => {
	if (!req.body) {
		throw new AppError('Please provide product information', 400)
	}

	const filtered = setProductToSchema(req.body)

	if (req.files.imageCover) {
		filtered.imageCover = req.files.imageCover
	}

	if (req.files.images) {
		filtered.images = req.files.images
	}

	const newProduct = await Product.create(filtered)

	responseSender(res, 201, {
		success: true,
		data: newProduct,
	})
}

export const updateProduct = async (req, res) => {
	const { slug } = req.query

	const optionsConfig = {
		new: true,
		runValidators: true,
	}

	const product = await Product.findOneAndUpdate({ slug }, req.body, optionsConfig)
	responseSender(res, 200, { success: true, data: product })
}
