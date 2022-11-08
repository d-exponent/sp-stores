import axios from 'axios'
import crypto from 'crypto'
import mongoose from 'mongoose'

import { orderSchema } from '../models/order-model'
import { getMongooseConnectArgs } from '../lib/db-utils'
import { purify } from '../lib/utils'
import { responseSender } from '../lib/controller-utils'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

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
			Authorization: `Bearer ${PAYSTACK_SECRET}`,
		},
	}

	const response = await axios.post(paystackInitUrl, data, axiosConfig)

	const {
		data: { authorization_url },
	} = response.data

	responseSender(res, 200, { success: true, auth_url: authorization_url })
}

export const webhook_checkout = (req, res) => {
	const { connectionString, connectionConfiq } = getMongooseConnectArgs()

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		res.status(200).send(200)

		const event = purify(req.body)
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

		console.log(order)
		//Using an isolated connection to create order documents
		mongoose
			.createConnection(connectionString, connectionConfiq)
			.asPromise()
			.then((connection) => {
				return connection.model('Order', orderSchema).create(order)
			})
			.then((doc) => {
				console.log(doc)
				mongoose.connection.close()
			})
			.catch((err) => {
				console.log(err.message)
				mongoose.connection.close()
			})
	}
}
