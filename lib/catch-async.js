import handleErrorResponse from '../controllers/error-controller'
import { AppError } from '../lib/app-error'
import { dbConnect } from '../lib/db-utils'

const catchAsync = func => async (req, res) => {
  try {
    await dbConnect()
    await func(req, res)
  } catch (err) {
    handleErrorResponse(err, res)
    AppError.saveServerErrorToDatabase(err)
  }
}

export default catchAsync
