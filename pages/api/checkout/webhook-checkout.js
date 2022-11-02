import crypto from 'crypto'
import mongoose from 'mongoose'

import Order from '../../../models/order-model'
import User from '../../../models/user-model'
import { purify } from '../../../lib/utils'

/**
 * We kept running into an error where await operations were not run
 * by the handler function.
 * So we are using callback operations to insert documents to our MongoDB collections
 */

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

		const event = purify(req.body)
		const eventData = event.data
		const { metadata } = eventData
		const { firstName, lastName } = metadata['customer_names']

		const orderOptions = {
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

		const userOptions = {
			firstName,
			lastName,
			email: eventData.customer.email,
			password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			regMethod: 'auto_on_paystack_payment',
		}

		//Lets just confirm that nothin is undefined
		console.log(orderOptions)
		console.log(userOptions)

		const newOrder = new Order(orderOptions)
		const newUser = new User(userOptions)

		//Lets confirm our models are working properly
		console.log(newUser)
		console.log(newOrder)

		mongoose
			.connect(
				`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true,
				}
			)
			.then(() => {
				newOrder.save((err) => console.log(err.message))
				newUser.save((err) => console.log(err.message))
			})
			.catch(() => console.log('Could not connect to mongodb'))
	}
}

export default handler
