import { dbConnect, activeConnection } from '../lib/db-utils'

export const connectDb = async (req, res, next) => {
	if (activeConnection?.isConnected) return next()

	await dbConnect()
	next()
}

export const withConnect = (func) => {
	return async (context) => {
		await dbConnect()

		return func(context)
	}
}
