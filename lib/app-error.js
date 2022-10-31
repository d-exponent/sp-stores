class AppError extends Error {
	constructor(message, status) {
		super(message)
		this.isOperational = true
		this.status = status
		Error.captureStackTrace(this, this.constructor)
	}
}

export default AppError
