import AppError from '../lib/app-error'
import catchAsync from '../middlewares/catch-async'
import User from '../models/user-model'
import { dbConnect } from '../lib/db-utils'
import { responseSender, bcryptCompare, bcryptHashed } from '../lib/controller-utils'

export const createUser = catchAsync(async (req, res) => {
	await dbConnect()
	const userOptions = { ...req.body, regMethod: req.body.regMethod || 'credentials' }

	await User.create(userOptions)

	responseSender(res, 201, { success: true })
})

export const updatePassword = catchAsync(async (req, res) => {
	const email = req.query.uemail
	const { currentPassword, newPassword } = req.body

	let errorMessage
	if (!email) {
		errorMessage = 'Please provide the email address'
		throw new AppError(errorMessage, 422)
	}

	if (!currentPassword || !newPassword) {
		errorMessage = 'Please provide the current password and the new password'
		throw new AppError(errorMessage, 422)
	}

	if (currentPassword === newPassword) {
		errorMessage = 'New password is the same as the old password'
		throw new AppError(errorMessage, 400)
	}

	await dbConnect()
	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		errorMessage = 'User is not found in our recoreds'
		throw new AppError(errorMessage, 404)
	}

	const isValidPassword = await bcryptCompare(currentPassword, user.password)
	if (!isValidPassword) {
		throw new AppError('Invalid password', 401)
	}

	const hashedNewPassword = await bcryptHashed(newPassword)
	const updateConfig = { new: true, runValidators: true }
	const body = { password: hashedNewPassword }

	await User.findOneAndUpdate({ email }, body, updateConfig)

	responseSender(res, 200, { success: true })
})
