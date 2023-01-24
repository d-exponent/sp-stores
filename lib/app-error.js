import ErrorModel from '../models/error-model'
import axios from 'axios'

export class AppError extends Error {
	constructor(message, status) {
		super(message)
		this.isOperational = true
		this.status = status
		Error.captureStackTrace(this, this.constructor)
	}

	static #isInstanceOfAppError(errorInstance) {
		return errorInstance instanceof this
	}

	static #setError(errorInstance) {
		const uncaugthValues = { ...errorInstance }

		delete uncaugthValues.name
		delete uncaugthValues.message
		delete uncaugthValues.stack
		delete uncaugthValues.isOperational
		delete uncaugthValues.cause

		let errorStackAsArray = errorInstance.stack.split('\n')

		// Remove the first stack frame (name: message)
		errorStackAsArray.shift()

		const errorTolog = {
			name: errorInstance.name,
			message: errorInstance.message,
			stackFrames: errorStackAsArray,
			isOperationalError: this.#isInstanceOfAppError(errorInstance),
			cause: errorInstance.cause || undefined,
			unCaughtFeilds: uncaugthValues || undefined,
		}

		return errorTolog
	}

	static async saveServerErrorToDatabase(errorInstance) {
		const errorToSaveToDb = this.#setError(errorInstance)

		try {
			await ErrorModel.create(errorToSaveToDb)
		} catch (e) {
			console.log('🧰 Error encontered saving error to database')
			console.log(errorToSaveToDb)
		}
	}

	static async saveClientErrorToDatabase(errorObject) {
		await axios.post('../pages/api/error', errorObject)
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
