import crypto from 'crypto'
import { MongoClient } from 'mongodb'

import { dbConnect } from '../../../lib/db-utils'
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

// async function getMongoClient() {
// 	try {
// 		const client = await MongoClient.connect(
// 			`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
// 		)
// 		return client
// 	} catch (err) {
// 		console.log(err.message || 'Error getting mongoDb clinet')
// 	}
// }

async function handler(req, res) {
	if (req.method !== 'POST') {
		return
	}

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		console.log('💳Incoming Paystack event at=>', new Date(Date.now()).toISOString())

		const eventData = req.body.data
		const { metadata } = eventData
		const { firstName, lastName } = metadata['customer_names']

		if (req.body.event === 'charge.success') {
			res.status(200).send(200)
		}

		const orderConfig = {
			currency: eventData.currency,
			items: metadata['bag_items_ids'],
			paystack_ref: eventData.reference,
			payment_method: eventData.channel,
			paystack_fees: +eventData.fees / 100,
			paid_at: new Date(eventData.paidAt).toUTCString(),
			payment_status: eventData.status,
			totalAmount: +eventData.amount / 100,
			userEmail: eventData.customer.email,
			customerCode: eventData.customer.customer_code,
		}

		console.log('💳Order Confiq', orderConfig)

		const userConfig = {
			firstName,
			lastName,
			email: eventData.customer.email,
			password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			regMethod: 'auto_on_paystack_payment',
		}

		console.log('💳User Confiq', userConfig)

		try {
			await dbConnect()
			console.log('💳Creating Order document ...')
			await Order.create(orderConfig)
			// await User.create(userConfig)

			console.log('💳Documents created successfully ...')
		} catch (err) {
			console.log('🧰' + err.message)
		}
		return
	}

	res.status(500).send(null)
}

export default handler
