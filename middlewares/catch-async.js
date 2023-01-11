import handleError from '../controllers/error-controller'
import { dbConnect } from '../lib/db-utils'

const catchAsync = async (req, res, func) => {
	try {
		await dbConnect()
		await func(req, res)
	} catch (err) {
		handleError(err, res)
	}
}

export default catchAsync
