import AppError from '../lib/app-error'
import { orderModel as Order } from '../models/order-model'
import { responseSender } from '../lib/controller-utils'

export const getAllOrders = async (req, res) => {
	const orders = await Order.find({})
	responseSender(res, 201, { success: true, data: orders })
}

export const createOrder = async (req, res) => {
	await Order.create(req.body)
	responseSender(res, 201, { success: true })
}

export const getOrderById = async (req, res) => {
	const orderId = req.query.orderId
	const order = await Order.findById(orderId)

	if (!order) {
		throw new AppError(`Order ${orderId} not found`, 404)
	}

	responseSender(res, 200, { success: true, data: order })
}
