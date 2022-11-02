import crypto from 'crypto'

import { dbConnect } from '../../../lib/db-utils'
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

async function handler(req, res) {
	if (req.method !== 'POST') {
		return
	}

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	//Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		console.log('💳Incoming Paystack event at=>', new Date(Date.now()).toISOString())

		const eventData = req.body.data
		const { metadata } = eventData
		const { firstName, lastName } = metadata['customer_names']

		if (req.body.event === 'charge.success') {
			res.status(200).send(200)
		}

		const orderConfig = {
			currency: eventData.currency,
			items: metadata['bag_items_ids'],
			paystack_ref: eventData.reference,
			payment_method: eventData.channel,
			paystack_fees: +eventData.fees / 100,
			paid_at: new Date(eventData.paidAt),
			payment_status: eventData.status,
			totalAmount: +eventData.amount / 100,
			userEmail: eventData.customer.email,
			customerCode: eventData.customer.customer_code,
		}

		const userConfig = {
			firstName,
			lastName,
			email: eventData.customer.email,
			password: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			confirmPassword: process.env.ON_PAY_PAYSTACK_WEBHOOK_USER,
			regMethod: 'auto_on_paystack_payment',
		}

		console.log('🧰Order confiq', orderConfig)
		console.log('🧰User confiq', userConfig)

		await dbConnect()
		// Create documents
		try {
			await Order.create(orderConfig)
		} catch (error) {
			console.log(error.message || '🧰Error creating order document')
		}

		try {
			await User.create(userConfig)
		} catch (error) {
			console.log(error.message || '🧰Error creating user document')
		}
	}
}

export default handler

const x = {
	event: 'charge.success',
	data: {
		id: 2239362670,
		domain: 'test',
		status: 'success',
		reference: 'auhi1tfjj8',
		amount: 47050000,
		message: null,
		gateway_response: 'Successful',
		paid_at: '2022-10-31T12:00:52.000Z',
		created_at: '2022-10-31T12:00:44.000Z',
		channel: 'card',
		currency: 'NGN',
		ip_address: '197.210.55.65',
		metadata: { bag_items: [Array], customer_details: [Object] },
		fees_breakdown: null,
		log: null,
		fees: 200000,
		fees_split: null,
		authorization: {
			authorization_code: 'AUTH_jgo6xrvuj9',
			bin: '408408',
			last4: '4081',
			exp_month: '12',
			exp_year: '2030',
			channel: 'card',
			card_type: 'visa ',
			bank: 'TEST BANK',
			country_code: 'NG',
			brand: 'visa',
			reusable: true,
			signature: 'SIG_ATKf5pEfUsK3CiMjjf4M',
			account_name: null,
			receiver_bank_account_number: null,
			receiver_bank: null,
		},
		customer: {
			id: 100210964,
			first_name: null,
			last_name: null,
			email: 'desmondodion24@gmail.com',
			customer_code: 'CUS_srai8dwtobjtp4v',
			phone: null,
			metadata: null,
			risk_action: 'default',
			international_format_phone: null,
		},
		plan: {},
		subaccount: {},
		split: {},
		order_id: null,
		paidAt: '2022-10-31T12:00:52.000Z',
		requested_amount: 47050000,
		pos_transaction_data: null,
		source: {
			type: 'api',
			source: 'merchant_api',
			entry_point: 'transaction_initialize',
			identifier: null,
		},
	},
}
