import crypto from 'crypto'

import { dbConnect } from '../../../lib/db-utils'
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

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
			paid_at: eventData.paidAt,
			payment_status: eventData.status,
			totalAmount: +eventData.amount / 100,
			userEmail: eventData.customer.email,
			customerCode: eventData.customer.customer_code,
		}

		const userConfig = {
			firstName,
			lastName,
			email: eventData.customer.email,
			password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			regMethod: 'auto_on_paystack_payment',
		}

		try {
			await dbConnect()
		} catch (err) {
			console.log(err.message || 'Error connection to database')
		}

		// Create documents
		try {
			await Order.create(orderConfig)
		} catch (err) {
			console.log(err.message || '🧰Error creating order document')
		}

		// Create new User if he/she doesnt exist
		// try {
		// 	await User.create(userConfig)
		// } catch (err) {
		// 	console.log(err.message || '🧰Error creating user document')
		// }

		return
	}

	res.status(500).send(null)
}

export default handler
