import axios from 'axios'
import crypto from 'crypto'

import Order from '../models/order-model'
import { responseSender, getBaseUrl } from '../lib/controller-utils'
import { request } from 'http'

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

export const webhook_checkout = async (req, res) => {
	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		res.status(200).send(200) // Let paystack know we received the event

		const event = req.body
		const { data } = event
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

		const newOrder = new Order(order)
		console.log(newOrder)
		
		try {
			await newOrder.save()
		} catch (error) {
			const myBaseUrl = getBaseUrl(req)

			await axios.post(`${myBaseUrl}/api/orders`, order).catch((error) => {
				console.log('🧰🧰ERROR!', error.response.data.message)
			})
		}
	}
}
