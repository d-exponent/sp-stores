import User from '../models/user-model'
import catchAsync from '../middlewares/catch-async'
import AppError from '../lib/app-error'

import { isValidEmail } from '../lib/utils'
import { dbConnect } from '../lib/db-utils'
import { responseSender } from '../lib/controller-utils'

export const getUsers = catchAsync(async (req, res) => {
	await dbConnect()
	const allUsers = await User.find({})

	if (!allUsers) {
		throw new AppError('No users were found', 404)
	}

	responseSender(res, 200, { success: true, data: allUsers })
})

export const getUser = catchAsync(async (req, res) => {
	const queryEmail = req.query.uemail

	//Validate the email address
	if (!isValidEmail(queryEmail)) {
		throw new AppError("Please provide a valid email format 'youremail@email.com'", 400)
	}

	await dbConnect()
	const user = await User.findOne({ email: queryEmail })

	if (!user) {
		throw new AppError('User not found', 404)
	}

	responseSender(res, 200, { success: true, data: user })
})
