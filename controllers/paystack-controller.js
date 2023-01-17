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
		throwOperationalError('Payment was unsucessful', 400)
	}

	try {
		const newOrder = await Order.create({
			currency: data.currency,
			cartItems: data.metadata.cartItems,
			paystack_ref: data.reference,
			paymentMethod: data.channel,
			paystackFees: +data.fees / 100,
			paidAt: data.paidAt,
			paymentStatus: data.status,
			totalAmount: +data.amount / 100,
			customerEmail: data.customer.email,
			customerName: data.metadata['customer_names'],
			customerCode: data.customer.customer_code,
			transactionReference: reference,
		})

		await newOrder.updateCartItems()

		sendResponse(res, 200, {
			success: true,
			message: 'Your purchase is successfull',
		})

	} catch (e) {
		
		const message =
			'There was an issue processing your payment. Contact customer care for any refund issues.'

		sendResponse(res, 500, { success: false, message })
	}
}
