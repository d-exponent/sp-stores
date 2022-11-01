import crypto from 'crypto'
import axios from 'axios'

import { purify } from '../../../lib/utils'
import { getHost } from '../../../lib/controller-utils'

async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(404).send('Only post request allowed')
	}

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		res.send(200)

		const host = getHost(req)
		const protocol = 'https'
		const createOrderUrl = `${protocol}://${host}/api/orders`
		const createUserUrl = `${protocol}://${host}/api/auth/users/register`

		console.log('🧰 Host ', host)

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

		// Create Order document
		try {
			await axios.post(createOrderUrl, orderConfig)
		} catch (error) {
			console.log(error.message)
		}

		// Create User document
		try {
			/**
			 * A duplicate error exception will be thrown if the user..
			 * exists .. We dont care about that.
			 * Else=> A new user will be created. This is what we care about
			 */
			await axios.post(createUserUrl, userConfig)
		} catch (error) {
			console.log(error.message)
		}
	}
	res.status(401).send(null)
}

export default handler
