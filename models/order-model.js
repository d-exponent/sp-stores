import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
	{
		userEmail: {
			type: String,
			required: [true, "An order must belong to a user's Email"],
		},
		items: {
			type: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
			required: [true, 'Order items must have at least one product'],
		},
		currency: String,
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		totalAmount: {
			type: Number,
			required: [true, 'An order must have a total amount of purchase'],
		},
		paid_at: String,
		paystack_ref: String,
		paystack_fees: {
			type: Number,
			required: [true, 'Paystack fees must be included in the order'],
		},
		payment_method: {
			type: String,
			required: [true, 'An order must have a payment method'],
		},
		payment_status: {
			type: String,
			required: [true, 'Order must contain a payment status'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

orderSchema.virtual('totalItemsPurchased').get(function () {
	return this.items.length
})

orderSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'items',
		select: 'name price discountPrice slug',
	})

	this.select('-__v')
	next()
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order
