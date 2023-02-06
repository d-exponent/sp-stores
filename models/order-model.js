import mongoose from 'mongoose'
import Product from '../models/product-model'

import { modelVirtualsConfiq } from '../lib/db-utils'

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
		newQuantityForSize: Number,
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
		paystackCustomerCode: String,
		paystackCustomerId: Number,
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
		paystackPaymentMethod: {
			type: String,
			required: [true, 'An order must have a payment method'],
		},
		paystackPaymentStatus: {
			type: String,
			required: [true, 'Order must contain a payment status'],
		},
		paystackTransactionReference: {
			type: String,
			required: [true, 'Order must contain a payment reference'],
		},
	},
	modelVirtualsConfiq
)

orderSchema.methods.updateCartItemsSizes = async function () {
	const runSavePromises = this.cartItems.map(async (cartItem) => {
		const { productId, itemSize, newQuantityForSize } = cartItem

		// Update the quantity for the purchased product
		const updatedProductItem = await Product.findOneAndUpdate(
			{ _id: productId, 'sizes.size': itemSize },
			{ $set: { 'sizes.$.quantity': newQuantityForSize } },
			{ new: true }
		)

		// Triqqer the save middlewares but not schema validation
		return updatedProductItem.save({ validateBeforeSave: false })
	})

	await Promise.all(runSavePromises)
}

orderSchema.virtual('totalItemsPurchased').get(function () {
	return this.cartItems.length
})

orderSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
