import axios from 'axios'
import crypto from 'crypto'

import Order from '../models/order-model'
import User from '../models/user-model'
import catchAsync from '../middlewares/catch-async'
import { dbConnect } from '../lib/db-utils'
import { responseSender } from '../lib/controller-utils'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

export const createSession = catchAsync(async (req, res) => {
	const { client, items } = req.body

	const paystackInitUrl = 'https://api.paystack.co/transaction/initialize'

	const data = {
		email: client.email,
		amount: items.totalPrice,
		currency: 'NGN',
		metadata: {
			bag_items: items.ids,
			customer_details: {
				firstName: client.firstName,
				lastName: client.lastName,
				email: client.email,
				// TODO: add users phone number after 2fa implementation
			},
		},
	}

	const axiosConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PAYSTACK_SECRET}`,
		},
	}

	const response = await axios.post(paystackInitUrl, data, axiosConfig)

	const {
		data: { authorization_url },
	} = response.data

	responseSender(res, 200, { success: true, auth_url: authorization_url })
})

export const webhookCheckout = catchAsync(async (req, res) => {
	console.log('🧰WEBHOOK CHECKOUT HIT AT : ', new Date(Date.now()).toTimeString())
	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		console.log('Paystack signature verified🧰')
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

		return
	}

	res.status(403).send(null)
})
