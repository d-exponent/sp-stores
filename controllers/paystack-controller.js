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
	const hash = crypto
		.createHmac('sha512', PAYSTACK_SECRET)
		.update(JSON.stringify(req.body))
		.digest('hex')

	// Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		console.log('👍 Confirmed paystack request at: =>' + now)
		res.send(200)
	} else {
		return responseSender(res, 403, { success: false, message: null })
	}

	const event = req.body
	const { data } = event

	const autoUserPassword = ON_PAY_PAYSTACK_WEBHOOK_USER

	try {
		await dbConnect()
		// Check if the user already exists in the database
		const isUser = await User.findOne({ email: event.customer.email })

		if (!isUser) {
			// Create a new user document
			const customer = data.metadata['customer_details']
			await User.create({
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: event.customer.email,
				phoneNumber: '1234_dummy_numberfor_now',
				confirmPassword: autoUserPassword,
				password: autoUserPassword,
			})
		}

		let formattedPaidAt
		if (event.paidAt) {
			const fmtDateConfig = {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}

			formattedPaidAt = new Date(event.paidAt).toLocaleDateString('en-US', fmtDateConfig)
		}

		//Create order document
		await Order.create({
			currency: data.currency,
			items: data.metadata['bag_items'],
			paystack_ref: data.reference,
			payment_method: data.channel,
			paystack_fees: +data.fees / 100,
			paid_at: formattedPaidAt,
			payment_status: data.status,
			totalAmount: +data.amount / 100,
			userEmail: event.customer.email,
		})
	} catch (error) {
		console.log('🧰🧰Paystack Webhook Error', error.message)
	}
})
