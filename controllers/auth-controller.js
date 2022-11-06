import AppError from '../lib/app-error'
import Email from '../lib/email'
import catchAsync from '../middlewares/catch-async'
import User from '../models/user-model'
import { dbConnect } from '../lib/db-utils'
import {
	responseSender,
	bcryptCompare,
	getProtocol,
	getHost,
	bcryptHash,
	cryptoHash,
} from '../lib/controller-utils'

export const createUser = catchAsync(async (req, res) => {
	const { password, confirmPassword } = req.body

	if (password !== confirmPassword) {
		throw new AppError('Passwords are not the same.', 400)
	}
	await dbConnect()
	const newUser = await User.create(req.body)

	const protocol = getProtocol()
	const host = getHost(req)

	const url = `${protocol}://${host}`
	await new Email(newUser, url).sendWelcome()

	responseSender(res, 201, { success: true, message: 'Account created successfully' })
})

export const updatePassword = async (req, res) => {
	const email = req.query.uemail
	const { currentPassword, newPassword } = req.body

	let errorMessage
	if (!email) {
		errorMessage = 'Please provide the email address'
		throw new AppError(errorMessage, 422)
	}

	if (!currentPassword || !newPassword) {
		errorMessage = 'Please provide your current password and the new password'
		throw new AppError(errorMessage, 422)
	}

	if (currentPassword === newPassword) {
		errorMessage = 'New password is the same as the old password'
		throw new AppError(errorMessage, 400)
	}

	if (newPassword.length < 8) {
		throw new AppError('Password must be at least 8 characters', 400)
	}

	await dbConnect()
	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		errorMessage = 'This account is in our records'
		throw new AppError(errorMessage, 404)
	}

	const isValidPassword = await bcryptCompare(currentPassword, user.password)
	if (!isValidPassword) {
		throw new AppError('Invalid password', 401)
	}

	user.password = await bcryptHash(newPassword)
	user.passwordModifiedAt = Date.now()

	await user.save()

	responseSender(res, 200, { success: true, message: 'Password is updated sucessfully' })
}

export const forgotPassword = catchAsync(async (req, res) => {
	const { email } = req.body

	if (!email) {
		throw new AppError('Please provide the email address of your account', 422)
	}

	await dbConnect()
	const user = await User.findOne({ email })

	if (!user) {
		throw new AppError(
			'This account does not exist in our records. Confrim your email address and try again',
			404
		)
	}

	const resetToken = user.createResetToken()

	const protocol = getProtocol()
	const host = getHost(req)
	const resetUrl = `${protocol}://${host}/auth/reset-password?token=${resetToken}`

	try {
		await new Email(user, resetUrl).sendPasswordResetLink()
		await user.save({ validateBeforeSave: false })

		responseSender(res, 200, {
			success: true,
			message:
				"Check your email for the reset link. Check your Junk folder if it's not in your primary inbox ",
		})
	} catch (error) {
		user.passwordResetToken = undefined
		user.passwordResetTokenExpiresAt = undefined
		user.save((err) => console.log(err.message))

		return responseSender(res, 500, {
			success: false,
			message: error.message || 'Something went wrong!',
		})
	}
})

export const resetPassword = async (req, res) => {
	const { newPassword, confirmPassword, resetToken } = req.body

	if (!newPassword || !confirmPassword || !resetToken) {
		throw new AppError('Please provide valid credentials', 400)
	}

	if (newPassword !== confirmPassword) {
		throw new AppError('New password and confrim password mush match', 400)
	}

	if (newPassword.length < 8) {
		throw new AppError('Password must be at least 8 characters', 400)
	}

	const hashedToken = cryptoHash(resetToken)

	await dbConnect()
	const user = await User.findOne({ passwordResetToken: hashedToken }).select('+password')

	if (!user) {
		throw new AppError('Invalid Inputs. Try again !', 500)
	}

	const currentTime = Date.now()

	if (currentTime > user.passwordResetTokenExpiresAt) {
		throw new AppError('Your reset timer has expired', 400)
	}

	user.password = await bcryptHash(newPassword)
	user.passwordResetToken = undefined
	user.passwordResetTokenExpiresAt = undefined
	user.passwordModifiedAt = Date.now()

	await user.save()

	responseSender(res, 200, {
		success: true,
		message: 'Password has been reset successfully',
	})
}
