import axios from 'axios'

import throwOperationalError from '../lib/app-error'
import { responseSender } from '../lib/controller-utils'

export const createCheckoutSession = async (req, res) => {
	const { client, items } = req.body

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

	const response = await axios.post(
		'https://api.paystack.co/transaction/initialize',
		data,
		axiosConfig
	)

	const {
		data: { authorization_url },
	} = response.data

	if (!authorization_url) {
		throwOperationalError('Something went wrong!', 500)
	}

	responseSender(res, 200, { success: true, auth_url: authorization_url })
}


export const webHook_checkout = async (req, res) => {}
