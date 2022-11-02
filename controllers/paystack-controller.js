import axios from 'axios'

import catchAsync from '../middlewares/catch-async'
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


