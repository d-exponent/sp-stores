import Order from '../models/order-model'
import catchAsync from '../middlewares/catch-async'
import AppError from '../lib/app-error'

import { dbConnect } from '../lib/db-utils'
import { responseSender } from '../lib/controller-utils'



export const getAllOrders = catchAsync(async (req, res) => {
	await dbConnect()
	const orders = await Order.find({})

	responseSender(res, 201, { success: true, data: orders })
})

export const createOrder = catchAsync(async (req, res) => {

	console.log("creating order...")
	await dbConnect()
	const order = await Order.create(req.body)
	responseSender(res, 201, { success: true, data: order })
})

export const getOrderById = catchAsync(async (req, res) => {
	const orderId = req.query.orderId

	await dbConnect()
	const order = await Order.findById(orderId)

	if (!order) {
		throw new AppError(`Order ${orderId} not found`, 404)
	}

	responseSender(res, 200, { success: true, data: order })
})
