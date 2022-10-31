import { dbConnect } from '../../../lib/db-utils'
import Order from '../../../models/order-model'

async function handler(req, res) {
	if (req.method === 'GET') {
		const orderId = req.query.test

		await dbConnect()
		const order = await Order.findById(orderId)
		res.status(200).json({ success: true, data: order })
	}
}

export default handler
