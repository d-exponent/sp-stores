import axios from 'axios'

import { responseSender } from '../lib/controller-utils'


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
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
		},
	}

	const response = await axios.post(paystackInitUrl, data, axiosConfig)

	const {
		data: { authorization_url },
	} = response.data

	responseSender(res, 200, { success: true, auth_url: authorization_url })
}

