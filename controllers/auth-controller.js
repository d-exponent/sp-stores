import catchAsync from '../middlewares/catch-async'
import User from '../models/user-model'

import { dbConnect } from '../lib/db-utils'
import { responseSender } from '../lib/controller-utils'

export const createUser = catchAsync(async (req, res) => {
	await dbConnect()
	await User.create(req.body)

	responseSender(res, 201, { success: true })
})
