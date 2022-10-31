import crypto from 'crypto'
import { dbConnect } from '../../../lib/db-utils'
i
import Order from '../../../models/order-model'
import User from '../../../models/user-model'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		res
			.status(400)
			.json({ success: false, message: `${req.method} is not allowed on this route` })

		return
	}

	const EVENT = req.body
	const AUTO_USER_PASSWORD = process.env.ON_PAY_PAYSTACK_WEBHOOK_USER
	let IS_USER = false

	if (!EVENT) return

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(EVENT))
		.digest('hex')

	// Validate request payload from paystack
	if (hash !== req.headers['x-paystack-signature']) {
		return
	}

	const formatedDateNow = new Date(Date.now()).toUTCString()
	console.log('👍 Received Paystack EVENT at: =>' + formatedDateNow)
	res.send(200)

	try {
		await dbConnect()
	} catch (error) {
		console.log(`⚠⚠Error => Time: ${formatedDateNow}, message: ${error.message}`)
		return
	}

	const clientEmail = EVENT.customer.email
	console.log(clientEmail)

	try {
		IS_USER = await User.findOne({ email: clientEmail })
	} catch (error) {
		IS_USER = false
	}

	if (IS_USER === false) {
		// Create a new user document
		const customerDetails = EVENT.data.metadata['customer_details']
		console.log('🧰Customer details', customerDetails)

		const userOptions = {
			firstName: customerDetails.firstName,
			lastName: customerDetails.lastName,
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
}

export default handler
