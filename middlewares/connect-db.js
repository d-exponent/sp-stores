import { dbConnect } from '../lib/db-utils'

const connectDb = async (req, res, next) => {
	await dbConnect()
	next()
}

export default connectDb
