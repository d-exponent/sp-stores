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
		const eventData = event.data
		const { metadata } = eventData

		//Checkhing paystack event shape on popUp payments
		console.log('event🧰', event)
		
		const newOrder = new Order({
			currency: eventData.currency,
			items: metadata['bag_items_ids'],
			paystack_ref: eventData.reference,
			payment_method: eventData.channel,
			paystack_fees: +eventData.fees / 100,
			paid_at: new Date(eventData.paidAt).toUTCString(),
			payment_status: eventData.status,
			totalAmount: +eventData.amount / 100,
			customerEmail: eventData.customer.email,
			customerName: metadata['customer_names'],
			customerCode: eventData.customer.customer_code,
		})

		const { connectionString, connectionConfiq } = getMongooseConnectArgs()

		mongoose
			.connect(connectionString, connectionConfiq)
			.then(() => {
				newOrder.save((err) => (err ? console.log(err.message) : ''))
			})
			.catch(() => console.log('Could not connect to mongodb'))

		res.status(200).send(200)
	}
}

export default handler
