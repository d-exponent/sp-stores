import mongoose from 'mongoose'
import Product from '../models/product-model'

import { modelVirtualsConfiq } from '../lib/db-utils'
import { getQuantityFromSizes } from '../lib/model-util'

const cartItem = new mongoose.Schema(
	{
		productId: {
			type: String,
			required: [true, 'Please provide the product ID'],
		},
		productName: {
			type: String,
			required: [true, 'Please provide the product name'],
		},
		paidAmount: {
			type: Number,
			required: [true, 'Please provide the amount for this purchase'],
		},
		itemPrice: {
			type: Number,
			required: [true, 'Please provide the current price of this item'],
		},
		salesQuantity: {
			type: Number,
			required: [true, 'Please provide the quantity for this purchase'],
		},
		itemSize: {
			type: String,
			required: [true, 'Please provide the size of this product'],
		},
		brand: String,
		coverImage: {
			type: String,
			required: [true, 'Please provide the cover image for this product'],
		},
		purchasedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
)

const orderSchema = new mongoose.Schema(
	{
		customerEmail: {
			type: String,
			required: [true, 'An order must belong to a customers Email'],
			lowercase: true,
		},
		customerName: {
			type: String,
			required: [true, 'An orders customer must have a name'],
		},
		cartItems: {
			required: [true, 'An order must be made for at least one cart item'],
			type: [cartItem],
		},
		currency: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
		customerCode: String,
		totalAmount: {
			type: Number,
			required: [true, 'An order must have a total amount of purchase'],
		},
		paidAt: String,
		paystackRef: String,
		paystackFees: {
			type: Number,
			required: [true, 'Paystack fees must be included in the order'],
		},
		paymentMethod: {
			type: String,
			required: [true, 'An order must have a payment method'],
		},
		paymentStatus: {
			type: String,
			required: [true, 'Order must contain a payment status'],
		},
		transactionReference: {
			type: String,
			required: [true, 'Order must contain a payment status'],
		},
	},
	modelVirtualsConfiq
)

orderSchema.methods.updateCartItems = async function () {
	
	this.cartItems.forEach(async (item) => {
		const purchasedItem = await Product.findById(item.productId)

		const newSizes = purchasedItem.sizes.map((size) => {
			if (size.size === item.itemSize) {
				const updatedQuantity = size.quantity - item.salesQuantity
				size.quantity = updatedQuantity < 0 ? 0 : updatedQuantity
			}

			return size
		})

		purchasedItem.replaceSizes(newSizes)

		await purchasedItem.save()
	})
}

orderSchema.virtual('totalProducts').get(function () {
	return this.cartItems.length
})

orderSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
