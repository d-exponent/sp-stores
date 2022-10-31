import { responseSender } from '../lib/controller-utils'
import AppError from '../lib/app-error'
import { purify } from '../lib/utils'

function handleMongooseDuplicateError(err) {
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

function handleMongooseValidationError(err) {
	const messages = Object.values(err.errors).map((message) => message.message)
	const title = messages.length === 1 ? 'Invalid input' : 'Invalid inputs'
	const message = `${title}: ${messages.join(', ')}!`
	return new AppError(message, 400)
}

function sendProdError(res, err) {
	//Expose error message for operational errors
	if (err.isOperational) {
		const jsonRes = { success: false, message: err.message }
		return responseSender(res, err.status, jsonRes)
	}

	//Show generic message for non-operational errors
	jsonRes.message = 'Something went wrong'
	responseSender(res, 500, jsonRes)
}

function handleError(err, req, res, next) {
	let error = {
		name: err.name,
		errors: err.errors,
		stack: err.stack,
		message: err.message,
		status: err.status || 500,
		...purify(err),
	}

	if (err.code === 11000) {
		error = handleMongooseDuplicateError(err)
	}

	if (err.name === 'ValidationError') {
		error = handleMongooseValidationError(error)
	}

	//Development mode
	if (process.env.NODE_ENV !== 'production') {
		return responseSender(res, error.status || 500, {
			success: false,
			message: error.message,
			err,
		})
	}

	//Production Mode
	sendProdError(res, error)
}

export default handleError
