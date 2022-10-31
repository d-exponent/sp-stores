import crypto from 'crypto'
import { TbChevronsDownLeft } from 'react-icons/tb'
import { dbConnect } from '../../../lib/db-utils'
i
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

const handler = async (req, res) => {
	console.log('🧰 Webhook checkout hit')
	if (req.method !== 'POST' || !req.body) {
		return
	}

	const EVENT = req.body
	const AUTO_USER_PASSWORD = process.env.ON_PAY_PAYSTACK_WEBHOOK_USER
	let IS_USER = false
	console.log('🧰 EVENT: ', EVENT)
	console.log(typeof EVENT)

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(EVENT))
		.digest('hex')

	// Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		const formatedDateNow = new Date(Date.now()).toUTCString()
		console.log('👍 Received Paystack EVENT at: =>' + formatedDateNow)

		await dbConnect()

		const clientEmail = EVENT.customer.email
		const clientMetadata = EVENT.data.metadata['customer_details']
		console.log(clientEmail)
		console.log(clientMetadata)

		try {
			IS_USER = await User.findOne({ email: clientEmail })
		} catch (error) {
			IS_USER = false
		}

		if (IS_USER === false) {
			// Create a new user document
			console.log('🧰Customer details', clientMetadata)

			const userOptions = {
				firstName: clientMetadata.firstName,
				lastName: clientMetadata.lastName,
				email: clientEmail,
				phoneNumber: '1234_dummy_numberfor_now',
				confirmPassword: AUTO_USER_PASSWORD,
				password: AUTO_USER_PASSWORD,
			}
			console.log('🧰🧰 UserOptions', userOptions)
			try {
				const newUser = await User.create(userOptions)
				console.log('👍 New User', newUser)
			} catch (error) {
				console.log('⚠ Error creaing user', error.message)
			}
		}

		const fmtDateConfig = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}

		const formattedPaidAt = new Date(EVENT.paidAt).toLocaleDateString(
			'en-US',
			fmtDateConfig
		)

		//Create order document
		const orderOptions = {
			currency: EVENT.data.currency,
			items: EVENT.data.metadata['bag_items'],
			paystack_ref: EVENT.data.reference,
			payment_method: EVENT.data.channel,
			paystack_fees: +EVENT.data.fees / 100,
			paid_at: formattedPaidAt,
			payment_status: EVENT.data.status,
			totalAmount: +EVENT.data.amount / 100,
			userEmail: clientEmail,
		}

		try {
			const newOrder = await Order.create(orderOptions)
			console.log('🧰 New Order', newOrder)
		} catch (error) {
			console.log('🧰Error creating order document', error.message)
		}

		res.status(200).send(200)
	}
}

export default handler
