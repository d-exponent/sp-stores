import User from '../models/user-model'
import throwOperationalError from '../lib/app-error'
import { isValidEmail } from '../lib/utils'
import { sendResponse } from '../lib/controller-utils'

export const getUsers = async (req, res) => {
	const allUsers = await User.find({})

	if (!allUsers) {
		throwOperationalError('There are no users available', 404)
	}

	sendResponse(res, 200, { success: true, data: allUsers })
}

export const getUser = async (req, res) => {
	const { uemail: email } = req.query

	//Validate the email address
	if (!isValidEmail(email)) {
		throwOperationalError('Please double check your email address and try again', 400)
	}

	const user = await User.findOne({ email })

	if (!user) {
		throwOperationalError('User not found', 404)
	}

	sendResponse(res, 200, { success: true, data: user })
}

export const updateUser = async (req, res) => {
	const updatedUser = await User.findOneAndUpdate(req.query, req.body, {
		new: true,
		runValidators: true,
	})

	if (!updatedUser) {
		throwOperationalError('User update failed', 404)
	}

	sendResponse(res, 200, {
		success: true,
		data: updatedUser,
	})
}
