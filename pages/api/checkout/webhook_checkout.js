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

		const now = new Date(Date.now()).toISOString()

		const EVENT = purify(req.body)
		console.log('👍 Received Paystack EVENT at: =>' + now)

		const eventData = EVENT.data
		const eventMetadata = eventData.metadata
		const bagitems = eventMetadata['bag_items']
		const { email, firstName, lastName } = eventMetadata['customer_details']

		await dbConnect()

		//Create order document
		try {
			await Order.create({
				currency: eventData.currency,
				items: bagitems,
				paystack_ref: eventData.reference,
				payment_method: eventData.channel,
				paystack_fees: +eventData.fees / 100,
				paid_at: Date.now(),
				payment_status: eventData.status,
				totalAmount: +eventData.amount / 100,
				userEmail: email,
			})

			console.log(`👍 Order for ${email} created successfully at ${now}`)
		} catch (error) {
			console.log('🧰' + error.message || '💳💳Error creating order document')
		}

		//Handle new user if user doesn't exist
		try {
			const isUser = await User.findOne({ email })

			if (!isUser) {
				const newUser = await User.create({
					firstName,
					lastName,
					email,
					password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
					confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
					regMethod: 'auto_on_paystack_payment',
				})
				console.log(`👍 New user with email address ${newUser.email} created at ${now}`)
			}
		} catch (error) {
			console.log(`🧰${error.message || 'Error creating user'}`)
		}
	}
}

export default handler
