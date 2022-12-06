import mongoose from 'mongoose'
import Product from '../models/product-model'

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
		items: {
			required: [true, 'An order must be made for at least one item'],
			type: [
				{
					type: mongoose.Schema.ObjectId,
					ref: 'Product',
				},
			],
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

orderSchema.virtual('totalProducts').get(function () {
	return this.items.length
})

orderSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'items',
		select: 'name brand category price discountPrice ',
	})

	this.select('-__v')
	next()
})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
