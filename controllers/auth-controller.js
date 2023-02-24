import AppError from '../lib/app-error'
import Email from '../lib/email'
import User from '../models/user-model'
import { getToken } from 'next-auth/jwt'
import {
  bcryptCompare,
  getProtocol,
  getHost,
  bcryptHash,
  cryptoHash,
  isProductionEnv,
  sendResponse,
} from '../lib/controller-utils'

export const createUser = async (req, res) => {
  const { password, confirmPassword } = req.body

  if (!password || !confirmPassword) {
    AppError.throwAppError(
      'Please peovide you password and confirm password',
      400
    )
  }

  if (password.length < 8) {
    AppError.throwAppError(
      'Password must contain at least 8 characters!',
      400
    )
  }

  if (password !== confirmPassword) {
    AppError.throwAppError('Passwords do not match.', 400)
  }

  const newUser = await User.create(req.body)

  const protocol = getProtocol()
  const host = getHost(req)
  const url = `${protocol}://${host}`

  await new Email(newUser, url).sendWelcome()

  sendResponse(res, 201, {
    success: true,
    message: `Welcome to the Sp family ${newUser.name}`,
  })
}

export const updatePassword = async (req, res) => {
  const { userEmail: email } = req.query
  const { currentPassword, newPassword } = req.body

  if (!email) {
    AppError.throwAppError('Please provide the email address', 422)
  }

  if (!currentPassword || !newPassword) {
    AppError.throwAppError(
      'Please provide your current password and the new password',
      422
    )
  }

  if (currentPassword === newPassword) {
    AppError.throwAppError(
      'New password is the same as the old password',
      400
    )
  }

  if (newPassword.length < 8) {
    AppError.throwAppError('Password must be at least 8 characters', 400)
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    AppError.throwAppError('This account is not in our records', 404)
  }

  const isValidPassword = await bcryptCompare(
    currentPassword,
    user.password
  )

  if (!isValidPassword) {
    AppError.throwAppError('Invalid password', 401)
  }

  user.password = await bcryptHash(newPassword)
  user.passwordModifiedAt = Date.now()

  await user.save()

  sendResponse(res, 200, {
    success: true,
    message: 'The Password has been updated sucessfully',
  })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    AppError.throwAppError(
      'Please provide the email address of your account',
      422
    )
  }

  const user = await User.findOne({ email })

  if (!user) {
    AppError.throwAppError(
      'Not Found! Confrim your email address and try again',
      404
    )
  }

  const resetToken = user.createResetToken()
  const protocol = getProtocol()
  const host = getHost(req)
  const resetUrl = `${protocol}://${host}/auth/reset-password?token=${resetToken}`

  const resetEmailLink = new Email(user, resetUrl).sendPasswordResetLink()
  const updatedUser = user.save({ validateBeforeSave: false })

  try {
    await Promise.all([resetEmailLink, updatedUser])

    sendResponse(res, 200, {
      success: true,
      message:
        'A reset link has been sent to your email address. The Link expires in 5 minutes.',
    })
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiresAt = undefined
    user.save(err => AppError.saveServerErrorToDatabase(err))

    AppError.saveServerErrorToDatabase(error)

    sendResponse(res, 500, {
      success: false,
      message: isProductionEnv() ? 'Something went wrong!' : error.message,
    })
  }
}

export const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword, resetToken } = req.body

  if (!newPassword || !confirmPassword || !resetToken) {
    AppError.throwAppError('Please provide valid credentials', 400)
  }

  if (newPassword !== confirmPassword) {
    AppError.throwAppError('Password do not match', 400)
  }

  if (newPassword.length < 8) {
    AppError.throwAppError(
      'Password must be at least of 8 characters long',
      400
    )
  }

  const hashedToken = cryptoHash(resetToken)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
  }).select('+password')

  if (!user) {
    AppError.throwAppError('Invalid Inputs. Try again !', 400)
  }

  const currentTime = Date.now()

  if (currentTime > user.passwordResetTokenExpiresAt) {
    AppError.throwAppError('The link has expired.', 400)
  }

  user.password = await bcryptHash(newPassword)
  user.passwordResetToken = undefined
  user.passwordResetTokenExpiresAt = undefined
  user.passwordModifiedAt = currentTime

  await user.save()

  sendResponse(res, 200, {
    success: true,
    message: 'Password has been reset successfully',
  })
}

export const protect = async req => {
  const token = await getToken({ req })

  if (!token) {
    AppError.throwAppError('Your are not logged in', 401)
  }

  let loggedInUser = null

  //We have guest users and native registered users to consider
  try {
    loggedInUser = await User.findOne({ email: token.email })
  } catch (e) {
    loggedInUser = null
    AppError.saveServerErrorToDatabase(e)
  }

  if (!loggedInUser) {
    loggedInUser = { email: token.email, role: 'customer' }
  }

  req.user = loggedInUser

  return req
}

export const restrictTo = async ({ req, useProtect }, ...args) => {
  if (useProtect) req = await protect(req)

  if (!args.includes(req.user.role)) {
    AppError.throwAppError('You are not authorized to this resource', 401)
  }

  return req
}
