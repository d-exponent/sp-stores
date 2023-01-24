import handleError from '../controllers/error-controller'
import { AppError } from '../lib/app-error'
import { dbConnect } from '../lib/db-utils'

const catchAsync = async (req, res, func) => {
	
	await dbConnect()

	try {
		await func(req, res)
	} catch (err) {
		handleError(err, res)
		await AppError.saveServerErrorToDatabase(err)
	}

}

export default catchAsync
