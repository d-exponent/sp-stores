import AppError from '../lib/app-error'

import { isProductionEnv, sendResponse } from '../lib/controller-utils'
import { purify } from '../lib/utils'

export function handleMongooseDuplicateError(err) {
  const keyValueKeys = Object.keys(err.keyValue)
  const targetKey = keyValueKeys[0]

  let message
  if (targetKey === 'email') {
    message = `You already exits in our records. Try logging in instead!`
  } else {
    message = `This ${targetKey} already exits. Please try another!`
  }

  return new AppError(message, 409)
}

export function handleMongooseValidationError(err) {
  const messages = Object.values(err.errors).map(
    message => message.message
  )
  const title = messages.length === 1 ? 'Invalid input' : 'Invalid inputs'
  const message = `${title}: ${messages.join(', ')}!`

  return new AppError(message, 400)
}

export function sendProdError(res, err) {
  const jsonRes = { success: false, message: err.message }

  if (err.isOperational) {
    return sendResponse(res, err.status, jsonRes)
  }

  //Show generic message for non-operational errors
  jsonRes.message = 'Something went wrong'

  sendResponse(res, 500, jsonRes)
}

export default function handleErrorResponse(err, res) {
  let error = {
    ...purify(err),
    name: err.name,
    errors: err.errors,
    stack: err.stack,
    message: err.message,
    status: err.status || 500,
  }

  if (error.code === 11000) {
    error = handleMongooseDuplicateError(error)
  }

  if (error.name === 'ValidationError') {
    error = handleMongooseValidationError(error)
  }

  isProductionEnv()
    ? sendProdError(res, error)
    : sendResponse(res, error.status, {
        success: false,
        message: error.message,
        err,
      })
}
