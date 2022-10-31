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

		console.log(email)
		console.log(bagitems)

		await dbConnect()

		console.log(email)
		console.log(bagitems)

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

			console.log(`👍 Order for ${email} created successfully @ ${now}`)
		} catch (error) {
			console.log(error.message || '💳💳Error creating order document')
		}

		// if (IS_USER === false) {
		// 	try {
		// 		// Create a new user document
		// 		await User.create({
		// 			firstName: firstName,
		// 			lastName: lastName,
		// 			email,
		// 			phoneNumber: '1234_dummy_numberfor_now',
		// 			confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
		// 			password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
		// 		})
		// 	} catch (error) {
		// 		console.log('⚠ Error creating user', error.message)
		// 	}
		// }

		// try {
		// 	console.log('🧰 New Order', newOrder)
		// } catch (error) {
		// 	console.log('🧰Error creating order document', error.message)
		// }
	}
}

export default handler
