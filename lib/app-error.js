export class AppError extends Error {
	constructor(message, status) {
		super(message)
		this.isOperational = true
		this.status = status
		Error.captureStackTrace(this, this.constructor)
	}
}

/**
 *
 * @param {string} message  error message
 * @param {number} status status code for error
 */
const throwOperationalError = (message, status) => {
	throw new AppError(message, status)
}

export default throwOperationalError
