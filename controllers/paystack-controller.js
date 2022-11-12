import axios from 'axios'

import AppError from '../lib/app-error'
import { responseSender } from '../lib/controller-utils'

const PAYSTACK_AUTHORIZATION = {
	Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
}

export const createSession = async (req, res) => {
	const { client, items } = req.body

	const paystackInitUrl = 'https://api.paystack.co/transaction/initialize'

	const data = {
		email: client.email,
		amount: items.totalPrice,
		currency: 'NGN',
		metadata: {
			bag_items_ids: items.ids,
			customer_names: client.name,
		},
	}

	const axiosConfig = {
		headers: {
			'Content-Type': 'application/json',
			...PAYSTACK_AUTHORIZATION,
		},
	}

	const response = await axios.post(paystackInitUrl, data, axiosConfig)

	const {
		data: { authorization_url },
	} = response.data

	if (!authorization_url) {
		throw new AppError('Something went wrong!', 400)
	}

	responseSender(res, 200, { success: true, auth_url: authorization_url })
}

export const verifyCheckout = async (req, res) => {
	const { reference } = req.query

	const paystackVerifyUrl = `https://api.paystack.co/transaction/verify/${reference}`
	const response = await axios.get(paystackVerifyUrl, { headers: PAYSTACK_AUTHORIZATION })

	//TODO: Optional.. Save order document on this controller
	const {
		data: { status },
	} = response.data

	if (status !== 'success') {
		throw new AppError(
			'The transaction was not successful! Contact our customer support for cases of debits without refunds',
			500
		)
	}

	responseSender(res, 200, {
		success: true,
		message: 'Your payment was successfull. ',
	})
}

export const webHook_checkout = async (req, res) => {}
