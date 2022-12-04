import { dbConnect } from '../lib/db-utils'

export const withConnect = (func) => {
	return async (context) => {
		await dbConnect()

		return func(context)
	}
}
