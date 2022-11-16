import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import { dbConnect } from './db-utils'
import { purify } from './utils'

/**
 *
 * @param {object*} res NodeJs response object
 * @param {number} status The http status code to be sent in the resposne header
 * @param {object} messageObj Object to be sent as json a response
 *
 * Send the response from the server to the client
 */
export const sendResponse = (res, status, messageObj) => {
	res.status(status).json(messageObj)
}

/**
 *
 * @param {string} text a string to be hashed
 * @returns {string} a hashed string
 */
export const bcryptHash = async (text) => {
	return await bcrypt.hash(text, 12)
}

/**
 *
 * @param {string} plainPassword  String to be compared to a hash
 * @param {string} hashedPassword A hashed string to be compared against
 * @returns {boolean} true if the plainPassword is a match for the hashedPassword, flase otherwise
 */
export const bcryptCompare = async (plainPassword, hashedPassword) => {
	return await bcrypt.compare(plainPassword, hashedPassword)
}

/**
 *
 * @param {string} str String to be hashed
 * @returns {string} a hashed string
 */
export const cryptoHash = (str) => {
	return crypto.createHash('sha256').update(str).digest('hex')
}

/**
 *
 * @param {string} bytes
 * @returns
 */
export const cryptoToken = (bytes) => {
	return crypto.randomBytes(bytes).toString('hex')
}

/**
 *
 * @returns {string} http or https depending on the node enviroment
 */
export const getProtocol = () => {
	if (process.env.NODE_ENV === 'production') {
		return 'https'
	}

	return 'http'
}

export const getHost = (req) => req.headers.host

/**
 * @param {object}
 * @return {string} base URL of the	request
 */
export const getBaseUrl = (req) => {
	const protocol = getProtocol()
	const host = getHost(req)

	return `${protocol}://${host}`
}

/**
 *
 * @param {object} Model A mongoose model
 * @param {string} group The document key you want to group by
 * @returns {{_id: string; groups:object}[]} an array of aggregated documents objects.
 */
export const getDocumentsByGroups = async (Model, group) => {
	/**Returns an array of documents that match a group aggregate*/
	await dbConnect()

	const groups = await Model.aggregate([
		{
			$group: {
				_id: `$${group}`,
				group: { $push: '$$ROOT' },
			},
		},
	])

	return purify(groups)
}
