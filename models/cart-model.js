import mongoose from 'mongoose'
import Product from './product-model'

import { modelVirtualsConfiq } from '../lib/db-utils'

const cartSchema = new mongoose.Schema({
	item: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Product,
		required: [true, 'Please provide the product id from the current cart item'],
	},
	quantity: {
		type: Number,
		required: [true, 'A cart item must have a quantity'],
	},
	size: {
		type: Number,
		required: [true, 'A cart item must have a size'],
	},
	totalPaid: {
		type: Number,
		required: [true, 'A cart item must have a total purchase price paid for it'],
	},
})

cartSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'item',
		select: 'name brand category color price discountPrice',
	})

	next()
})

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema)
