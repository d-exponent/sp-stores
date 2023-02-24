import ErrorModel from '../models/error-model'
import { dbConnect } from './db-utils'

export class AppError extends Error {
  /**
   *
   * @param {string} message error message
   * @param {number} status error status code
   */
  constructor(message, status, options) {
    super(message, options)
    this.isOperational = true
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   *
   * @param {object} errorInstance  to be processed
   * @returns {object} errorObject  with set properties
   */
  static #setErrorProperties(errorInstance) {
    const uncaugthValues = { ...errorInstance }
    const toExclude = [
      'name',
      'message',
      'stack',
      'isOperational',
      'cause',
    ]

    toExclude.forEach(el => delete uncaugthValues[el])

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
   * @param {object} errorInstance to be saved to the database
   * @param {function} callback callback function to receive the saved error doc or an error
   */
  static saveServerErrorToDatabase(errorInstance, callback) {
    const errorToSaveToDb = this.#setErrorProperties(errorInstance)

    //Using chained promises and callback to enforse async non blocking operation
    //I don't want the program wait for this function to execute
    dbConnect()
      .then(() => ErrorModel.create(errorToSaveToDb))
      .then(doc => callback && callback(null, doc))
      .catch(e => {
        console.log(this.#setErrorProperties(e))
        callback && callback(e, null)
      })
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
