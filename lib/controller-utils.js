import bcrypt from 'bcryptjs'

export const responseSender = (res, status, messageObj) => {
	res.status(status).json(messageObj)
}

export const bcryptHashed = async (text, saltRounds) => {
	return await bcrypt.hash(text, saltRounds)
}

export const bcryptCompare = async (plainPassword, hashedPassword) => {
	return await bcrypt.compare(plainPassword, hashedPassword)
}

export const getHttpProtocol = (req) => req.headers.referer.split('://')[0]

export const getHost = (req) => req.headers.host

export const getBaseUrl = (req) => {
	const protocol = getHttpProtocol(req)
	const host = getHost(req)
	return `${protocol}://${host}`
}
