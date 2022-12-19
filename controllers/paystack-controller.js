import axios from 'axios'

import Order from '../models/order-model'
import throwOperationalError from '../lib/app-error'
import { sendResponse } from '../lib/controller-utils'

export const verifyPayment = async (req, res) => {
	const { reference } = req.body

	const paystackVerifyUrl = `https://api.paystack.co/transaction/verify/${reference}`

	const axiosConfig = {
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
		},
	}

	const response = await axios.get(paystackVerifyUrl, axiosConfig)

	const {
		data: { data },
	} = response

	if (data.status !== 'success') {
		throwOperationalError('Payment was declined', 400)
	}

	sendResponse(res, 200, {
		success: true,
		message: 'Your payment was successfull',
	})

	//Save order document
	const { metadata } = data

	const order = {
		currency: data.currency,
		cartItems: metadata.cartItems,
		paystack_ref: data.reference,
		paymentMethod: data.channel,
		paystackFees: +data.fees / 100,
		paidAt: data.paidAt,
		paymentStatus: data.status,
		totalAmount: +data.amount / 100,
		customerEmail: data.customer.email,
		customerName: metadata['customer_names'],
		customerCode: data.customer.customer_code,
	}

	try {
		console.log(await Order.create(order))
	} catch (e) {
		console.log(e.message)
	}
}
