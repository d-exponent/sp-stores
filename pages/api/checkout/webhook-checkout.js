import crypto from 'crypto'

import { purify } from '../../../lib/utils'
import { dbConnect } from '../../../lib/db-utils'
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

async function handler(req, res) {
	if (req.method !== 'POST') {
		return
	}

	console.log('🧰WEBHOOK CHECKOUT HIT AT : ', new Date(Date.now()).toTimeString())
	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		console.log('Paystack signature verified🧰')

		console.log('🧰Reg dot body', req.body)

		const EVENT = purify(req.body)
		const eventData = EVENT.data
		const bagitems = eventData.metadata['bag_items']
		const { email, firstName, lastName } = eventData.metadata['customer_details']

		console.log('🧰EVENT', EVENT)

		const orderConfig = {
			currency: eventData.currency,
			items: bagitems,
			paystack_ref: eventData.reference,
			payment_method: eventData.channel,
			paystack_fees: +eventData.fees / 100,
			paid_at: new Date(Date.now()).toISOString(),
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

		if (EVENT.event === 'charge.success') {
			res.status(200).send(200)
		}

		console.log('🧰Order confiq', orderConfig)
		console.log('🧰User confiq', userConfig)

		try {
			await dbConnect()
		} catch (error) {
			console.log(error.message || '🧰connecting to database failed')
		}

		// Create documents
		try {
			await Order.create(orderConfig)
		} catch (error) {
			console.log(error.message || '🧰Error creating order document')
		}

		try {
			await User.create(userConfig)
		} catch (error) {
			console.log(error.message || '🧰Error creating user document')
		}
	}
}

export default handler
