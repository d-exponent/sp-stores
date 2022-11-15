import mongoose from 'mongoose'
import crypto from 'crypto'
import axios from 'axios'

import { orderSchema } from '../../../models/order-model'
import { getMongooseConnectArgs } from '../../../lib/db-utils'
import { getBaseUrl } from '../../../lib/controller-utils'

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
		res.status(200).send(200) // To paystack

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

		const { connectionString } = getMongooseConnectArgs()
		mongoose
			.createConnection(connectionString)
			.asPromise()
			.then((connection) => {
				return connection.model('Order', orderSchema).create(order)
			})
			.then(() => {
				console.log('👍Order created successfully')
			})
			.catch((err) => {
				console.log('🧰 Initial Error message: ' + err.message)
				
				//Last resort
				axios.post(`${getBaseUrl(req)}/api/orders`, order).catch((error) => {
					console.log('🧰🧰ERROR! ' + error.response.data.message)
				})
			})
	}
}
