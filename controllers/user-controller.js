import User from '../models/user-model'
import AppError from '../lib/app-error'
import catchAsync from '../lib/catch-async'
import { isValidEmail } from '../lib/utils'
import { sendResponse } from '../lib/controller-utils'

const filterRequest = (body, ...args) => {
  const filtered = {}

  Object.keys(body).forEach(key => {
    if (args.includes(key)) {
      filtered[key] = body[key]
    }
  })

  return filtered
}

export const getUsers = async (req, res) => {
  const allUsers = await User.find({})

  if (!allUsers) {
    AppError.throwAppError('There are no users available', 404)
  }

  sendResponse(res, 200, { success: true, data: allUsers })
}

export const getUser = async (req, res) => {
  const { uemail: email } = req.query

  //Validate the email address
  if (!isValidEmail(email)) {
    AppError.throwAppError(
      'Please double check your email address and try again',
      400
    )
  }

  const user = await User.findOne({ email })

  if (!user) {
    AppError.throwAppError('User not found', 404)
  }

  sendResponse(res, 200, { success: true, data: user })
}

export const updateUser = async (req, res) => {
  const updatedUser = await User.findOneAndUpdate(req.query, req.body, {
    new: true,
    runValidators: true,
  })

  if (!updatedUser) {
    AppError.throwAppError('User update failed', 404)
  }

  sendResponse(res, 200, {
    success: true,
    data: updatedUser,
  })
}

export const updateMe = catchAsync(async (req, res) => {
  const { query, body } = req

  if (body.currentPassword || body.newPassword || body.password) {
    AppError.throwAppError("You can't update password on this route", 400)
  }

  const searchQuery = { email: query.userEmail }
  const filteredBody = filterRequest(
    body,
    'firstName',
    'lastName',
    'email',
    'phoneNumber'
  )

  const queryConfiq = {
    new: true,
    runValidators: true,
  }

  const updatedUser = await User.findOneAndUpdate(
    searchQuery,
    filteredBody,
    queryConfiq
  )

  sendResponse(res, 200, {
    success: true,
    data: updatedUser,
  })
})

export const deleteMe = catchAsync(async (req, res) => {
  await User.findOneAndUpdate(
    { email: req.query.userEmail },
    { active: false }
  )

  sendResponse(res, 204, { success: true, data: null })
})

export const getMe = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.query.userEmail })

  sendResponse(res, 200, { success: true, data: user })
})
