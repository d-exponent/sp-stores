import { dbConnect } from '../../../lib/db-utils'
import Order from '../../../models/order-model'
import User from '../../../models/user'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return res
			.status(400)
			.json({ success: false, message: `${req.method} is not allowed on this route` })
	}

	const hash = crypto
		.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest('hex')

	// Validate request payload from paystack
	if (hash == req.headers['x-paystack-signature']) {
		console.log(
			'👍 Confirmed paystack webhook at: =>' + new Date(Date.now()).toUTCString()
		)
		res.send(200)
	} else {
		return res.status(403).json({ success: false, message: null })
	}

	const event = req.body
	const { data } = event

	const autoNewUserPassword = process.env.ON_PAY_PAYSTACK_WEBHOOK_USER
	try {
		await dbConnect()
		// Check if the user already exists in the database
		const isUser = await User.findOne({ email: event.customer.email })

		if (!isUser) {
			// Create a new user document
			const customer = data.metadata['customer_details']
			await User.create({
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: event.customer.email,
				phoneNumber: '1234_dummy_numberfor_now',
				confirmPassword: autoNewUserPassword,
				password: autoNewUserPassword,
			})
		}

		let formattedPaidAt
		if (event.paidAt) {
			const fmtDateConfig = {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}

			formattedPaidAt = new Date(event.paidAt).toLocaleDateString('en-US', fmtDateConfig)
		}

		//Create order document
		await Order.create({
			currency: data.currency,
			items: data.metadata['bag_items'],
			paystack_ref: data.reference,
			payment_method: data.channel,
			paystack_fees: +data.fees / 100,
			paid_at: formattedPaidAt,
			payment_status: data.status,
			totalAmount: +data.amount / 100,
			userEmail: event.customer.email,
		})
	} catch (error) {
		console.log('🧰🧰Paystack Webhook Error', error.message)
	}
}

export default handler
