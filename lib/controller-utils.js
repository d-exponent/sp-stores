import bcrypt from 'bcryptjs'
import crypto from 'crypto'

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
