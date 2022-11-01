import mongoose from 'mongoose'
import ProductModel from '../models/product-model'

import { purify } from './utils'

const databaseConnectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
const connection = {}

/** Connects to mongoDb with mongoose.connect method  */
export async function dbConnect() {
	console.log('Connecting to database...')
	// if (connection.isConnected) return

	const connectConfig = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}

	try {
		// const db = await mongoose.connect(databaseConnectionString, connectConfig)
		await mongoose.connect(databaseConnectionString, connectConfig)
		// connection.isConnected = db.connections[0].readyState === 1
	} catch (error) {
		throw new Error('Error connecting to database')
	}

	console.log('Connection to database established')
}

export async function getProductsByCategory() {
	await dbConnect()

	const groups = await ProductModel.aggregate([
		{
			$group: {
				_id: '$category',
				group: { $push: '$$ROOT' },
			},
		},
	])

	return purify(groups)
}

/** Returns a modified object with properties set to match schema specs*/
export function setProductToSchema(obj) {
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
	const objectToModelSchema = {}

	//Set the data type of the product's value to match the Schema
	configArr.forEach((element) => {
		if (element === 'quantity') {
			// Convert value to Number data type
			return (objectToModelSchema[element] = +obj[element])
		}

		if (element === 'sizes') {
			// Lets make sure of no duplicates
			const sizesArray = obj[element].split(',') //Split to an array
			const unique = [...new Set(sizesArray)] // Remove duplicates

			return (objectToModelSchema[element] = unique)
		}

		if (element === 'price' || element === 'discountPrice') {
			const initialValue = obj[element]

			const valueFormatted = initialValue.replace(/,/g, '') //lets remove commas
			const finalValue = valueFormatted ? +valueFormatted : +initialValue //convert to Number

			return (objectToModelSchema[element] = finalValue)
		}

		objectToModelSchema[element] = obj[element]
	})

	return objectToModelSchema
}
