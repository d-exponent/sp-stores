import AppError from '../lib/app-error'
import  Order  from '../models/order-model'
import { sendResponse } from '../lib/controller-utils'

export const getAllOrders = async (req, res) => {
	const orders = await Order.find({})
	sendResponse(res, 201, { success: true, data: orders })
}

export const createOrder = async (req, res) => {
	await Order.create(req.body)
	sendResponse(res, 201, { success: true })
}

export const getOrderById = async (req, res) => {
	const { orderId } = req.query
	const order = await Order.findById(orderId)
	sendResponse(res, 200, { success: true, data: order })
}
