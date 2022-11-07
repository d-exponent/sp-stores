import crypto from 'crypto'
import mongoose from 'mongoose'

import { getMongooseConnectArgs } from '../../../lib/db-utils'
import Order from '../../../models/order-model'
import { purify } from '../../../lib/utils'

function handler(req, res) {
	if (req.method !== 'POST') {
		return
	}

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		const event = purify(req.body)
		const { data } = event
		const { metadata } = data

		const newOrder = new Order({
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
		})

		const { connectionString, connectionConfiq } = getMongooseConnectArgs()

		mongoose
			.connect(connectionString, connectionConfiq)
			.then(() => {
				console.log('MongoDB connection established👍')
				newOrder.save((err) => (err ? console.log(err.message) : ''))
			})
			.catch(() => console.log('Could not connect to mongodb cluster🧰'))

		res.status(200).send(200)
	}
}

export default handler
