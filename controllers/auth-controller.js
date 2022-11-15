import throwOperationalError from '../lib/app-error'
import Email from '../lib/email'
import User from '../models/user-model'
import {
	responseSender,
	bcryptCompare,
	getProtocol,
	getHost,
	bcryptHash,
	cryptoHash,
} from '../lib/controller-utils'

export const createUser = async (req, res) => {
	const { password, confirmPassword } = req.body

	if (password.length < 8) {
		throwOperationalError('The password must be at least 8 characters', 400)
	}

	if (password !== confirmPassword) {
		throwOperationalError('Passwords are not the same.', 400)
	}

	const newUser = await User.create(req.body)

	const protocol = getProtocol()
	const host = getHost(req)
	const url = `${protocol}://${host}`

	await new Email(newUser, url).sendWelcome()
	responseSender(res, 201, { success: true, message: 'Account created successfully' })
}

export const updatePassword = async (req, res) => {
	const { uemail: email } = req.query
	const { currentPassword, newPassword } = req.body

	if (!email) {
		throwOperationalError('Please provide the email address', 422)
	}

	if (!currentPassword || !newPassword) {
		throwOperationalError(
			'Please provide your current password and the new password',
			422
		)
	}

	if (currentPassword === newPassword) {
		throwOperationalError('New password is the same as the old password', 400)
	}

	if (newPassword.length < 8) {
		throwOperationalError('Password must be at least 8 characters', 400)
	}

	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		throwOperationalError('This account is in our records', 404)
	}

	const isValidPassword = await bcryptCompare(currentPassword, user.password)
	if (!isValidPassword) {
		throwOperationalError('Invalid password', 401)
	}

	user.password = await bcryptHash(newPassword)
	user.passwordModifiedAt = Date.now()
	await user.save()

	responseSender(res, 200, { success: true, message: 'Password is updated sucessfully' })
}

export const forgotPassword = async (req, res) => {
	const { email } = req.body

	if (!email) {
		throwOperationalError('Please provide the email address of your account', 422)
	}

	const user = await User.findOne({ email })
	if (!user) {
		throwOperationalError('Not Found! Confrim your email address and try again', 404)
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
}

export const resetPassword = async (req, res) => {
	const { newPassword, confirmPassword, resetToken } = req.body

	if (!newPassword || !confirmPassword || !resetToken) {
		throwOperationalError('Please provide valid credentials', 400)
	}

	if (newPassword !== confirmPassword) {
		throwOperationalError('New password and confrim password mush match', 400)
	}

	if (newPassword.length < 8) {
		throwOperationalError('Password must be at least 8 characters', 400)
	}

	const hashedToken = cryptoHash(resetToken)
	const user = await User.findOne({ passwordResetToken: hashedToken }).select('+password')

	if (!user) {
		throwOperationalError('Invalid Inputs. Try again !', 500)
	}

	const currentTime = Date.now()
	if (currentTime > user.passwordResetTokenExpiresAt) {
		throwOperationalError('Your reset timer has expired', 400)
	}

	user.password = await bcryptHash(newPassword)
	user.passwordResetToken = undefined
	user.passwordResetTokenExpiresAt = undefined
	user.passwordModifiedAt = currentTime
	await user.save()

	responseSender(res, 200, {
		success: true,
		message: 'Password has been reset successfully',
	})
}
