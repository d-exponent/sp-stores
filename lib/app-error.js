import ErrorModel from '../models/error-model'
import axios from 'axios'

export class AppError extends Error {
	constructor(message, status) {
		super(message)
		this.isOperational = true
		this.status = status
		Error.captureStackTrace(this, this.constructor)
	}

	static #isInstanceOfAppError(instance) {
		return instance instanceof this
	}

	static #setError(error) {
		const isOperational = this.#isInstanceOfAppError(errorInstance)

		const uncaugthValues = { ...error }

		delete uncaugthValues.name
		delete uncaugthValues.message
		delete uncaugthValues.stack
		delete uncaugthValues.isOperational
		delete uncaugthValues.cause

		const errorTolog = {
			name: error.name,
			message: error.message,
			stack: error.stack,
			isOperationalError: isOperational,
			cause: error.cause,
			unCaughtFeilds: uncaugthValues,
		}

		return errorTolog
	}

	static async saveServerErrorLogsToDB(errorInstance) {

		const toSave = this.#setError(errorInstance)

		try {
			await ErrorModel.create(toSave)
		} catch (e) {
			this.saveClientErrorLogsToDB(e)
		}
	}
	static async saveClientErrorLogsToDB(errorObject) {

		
		await axios.post('../pages/api/')
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
