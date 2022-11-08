import crypto from 'crypto'
import mongoose from 'mongoose'

import { orderSchema } from '../../../models/order-model'
import { getMongooseConnectArgs } from '../../../lib/db-utils'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return
	}

	const { connectionString, connectionConfiq } = getMongooseConnectArgs()

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		res.status(200).send(200)

		const event = req.body
		const { data } = event
		const { metadata } = data

		const order = {
			currency: data.currency,
			items: metadata['bag_items_ids'],
			paystack_ref: data.reference,
			payment_method: data.channel,
			paystack_fees: +data.fees / 100,
			paid_at: data.paidAt,
			payment_status: data.status,
			totalAmount: +data.amount / 100,
			customerEmail: data.customer.email,
			customerName: metadata['customer_names'],
			customerCode: data.customer.customer_code,
		}

		//Using an isolated connection to create order documents
		mongoose
			.createConnection(connectionString, connectionConfiq)
			.asPromise()
			.then((connection) => {
				return connection.model('Order', orderSchema).create(order)
			})
			.then((doc) => {
				console.log(doc)
				mongoose.connection.close()
			})
			.catch((err) => {
				console.log(err.message)
				mongoose.connection.close()
			})
	}
}

export default handler
