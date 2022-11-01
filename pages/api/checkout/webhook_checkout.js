import crypto from 'crypto'

import { dbConnect } from '../../../lib/db-utils'
import { purify } from '../../../lib/utils'
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(404).send('Only post request allowed')
		return
	}

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	// Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		res.send(200)

		const EVENT = purify(req.body)

		const eventData = EVENT.data
		const bagitems = eventData.metadata['bag_items']
		const { email, firstName, lastName } = eventData.metadata['customer_details']

		const orderConfig = {
			currency: eventData.currency,
			items: bagitems,
			paystack_ref: eventData.reference,
			payment_method: eventData.channel,
			paystack_fees: +eventData.fees / 100,
			paid_at: Date.now(),
			payment_status: eventData.status,
			totalAmount: +eventData.amount / 100,
			userEmail: email,
		}

		const userConfig = {
			firstName,
			lastName,
			email,
			password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			regMethod: 'auto_on_paystack_payment',
		}

		console.log('👍 Received Paystack EVENT at: =>', new Date(Date.now()).toISOString())
		console.log('🧰 User Config', userConfig)
		console.log('🧰 Order config', orderConfig)

		await dbConnect()

		try {
			//Create order document
			await Order.create(orderConfig)
		} catch (err) {
			console.log('Error creating order document')
		}

		try {
			// Will throw a duplicate error if user already exists
			// Or will create a new user Otherwise
			await User.create(userConfig)
		} catch (err) {
			console.log('Error creating user document')
		}
	}
}

export default handler
