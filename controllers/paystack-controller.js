import axios from 'axios'

import Order from '../models/order-model'
import throwOperationalError from '../lib/app-error'
import { sendResponse } from '../lib/controller-utils'

// export const createCheckoutSession = async (req, res) => {
// 	const { client, items } = req.body

// 	const data = {
// 		email: client.email,
// 		amount: items.totalPrice,
// 		currency: 'NGN',
// 		metadata: {
// 			bag_items_ids: items.ids,
// 			customer_names: client.name,
// 		},
// 	}

// 	const axiosConfig = {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
// 		},
// 	}

// 	const response = await axios.post(
// 		'https://api.paystack.co/transaction/initialize',
// 		data,
// 		axiosConfig
// 	)

// 	const {
// 		data: { authorization_url },
// 	} = response.data

// 	if (!authorization_url) {
// 		throwOperationalError('Something went wrong!', 500)
// 	}

// 	sendResponse(res, 200, { success: true, auth_url: authorization_url })
// }

export const verifyPayment = async (req, res) => {
	const { reference } = req.query

	const paystackVerifyUrl = `https://api.paystack.co/transaction/verify/${reference}`

	const axiosConfig = {
		headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
	}

	const response = await axios.get(paystackVerifyUrl, axiosConfig)

	const {
		data: { data },
	} = response

	if (data.status !== 'success') {
		throwOperationalError('Payment was declined', 400)
	}

	sendResponse(res, 200, { success: true, message: 'Your payment was successfull' })

	//Save order document
	const { metadata } = data

	const order = {
		currency: data.currency,
		items: metadata['bag_items_ids'],
		paystack_ref: data.reference,
		payment_method: data.channel,
		paystack_fees: +data.fees / 100,
		paid_at: data.paidAt,
		payment_status: data.status,
		totalAmount: +data.amount / 100,
		customerEmail: data.customer.email,
		customerName: metadata['customer_names'],
		customerCode: data.customer.customer_code,
	}

	try {
		await Order.create(order)
	} catch (e) {
		console.log(e.message)
	}
}

