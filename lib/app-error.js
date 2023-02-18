import ErrorModel from '../models/error-model'
import { dbConnect } from './db-utils'

export class AppError extends Error {
	/**
	 *
	 * @param {string} message
	 * @param {number} status
	 */
	constructor(message, status) {
		super(message)
		this.isOperational = true
		this.status = status
		Error.captureStackTrace(this, this.constructor)
	}

	/**
	 *
	 * @param {object} errorInstance
	 * @returns {object}
	 */
	static #setErrorProperties(errorInstance) {
		const uncaugthValues = { ...errorInstance }
		const toExclude = ['name', 'message', 'stack', 'isOperational', 'cause']

		toExclude.forEach((el) => delete uncaugthValues[el])

		return {
			name: errorInstance.name,
			message: errorInstance.message,
			stackFrames: errorInstance.stack.split('\n'),
			isOperationalError: errorInstance instanceof this,
			cause: errorInstance.cause || undefined,
			unCaughtFeilds: uncaugthValues || undefined,
		}
	}

	/**
	 *
	 * @param {object} errorInstance
	 * @param {function} callback
	 */
	static saveServerErrorToDatabase(errorInstance, callback) {
		const errorToSaveToDb = this.#setErrorProperties(errorInstance)

		//Using chained promised and callback to enforse async non blocking operation
		//I don't want the program wait for this function to finish
		dbConnect()
			.then(() => ErrorModel.create(errorToSaveToDb))
			.then((doc) => callback && callback(null, doc))
			.catch((e) => callback && callback(e, null))
	}

	/**
	 *
	 * @param {string} message  error message
	 * @param {number} status status code for error
	 */
	static throwAppError(message, status) {
		throw new this(message, status)
	}
}

export default AppError
