import Order from '../models/order-model'
import throwOperationalError from '../lib/app-error'
import { sendResponse } from '../lib/controller-utils'

export const getAllOrders = async (req, res) => {
	const orders = await Order.find(req.query)

	if (orders.length === 0) {
		throwOperationalError('Could not find orders', 400)
	}

	sendResponse(res, 200, {
		success: true,
		results: orders.length,
		data: orders,
	})
}

export const createOrder = async (req, res) => {
	await Order.create(req.body)
	sendResponse(res, 201, { success: true })
}

export const getOrder = async (req, res) => {
	const order = await Order.findOne(req.query)

	sendResponse(res, 200, {
		success: true,
		data: order,
	})
}
