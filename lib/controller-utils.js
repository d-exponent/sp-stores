import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import Product from '../models/product-model'
import { dbConnect } from './db-utils'
import { purify } from './utils'

export const responseSender = (res, status, messageObj) => {
	res.status(status).json(messageObj)
}

export const bcryptHash = async (text) => {
	return await bcrypt.hash(text, 12)
}

export const bcryptCompare = async (plainPassword, hashedPassword) => {
	return await bcrypt.compare(plainPassword, hashedPassword)
}

export const cryptoHash = (str) => {
	return crypto.createHash('sha256').update(str).digest('hex')
}

export const cryptoToken = (bytes) => {
	return crypto.randomBytes(bytes).toString('hex')
}

export const getProtocol = () => {
	if (process.env.NODE_ENV === 'production') {
		return 'https'
	}

	return 'http'
}

export const getHost = (req) => req.headers.host

export const getBaseUrl = (req) => {
	const protocol = getProtocol()
	const host = getHost(req)

	return `${protocol}://${host}`
}

export const getDocumentsByGroups = async (Model, group) => {
	/**Returns an array of documents that match a group aggregate*/
	await dbConnect()

	console.log('Working')
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
