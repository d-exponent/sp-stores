import catchAsync from '../middlewares/catch-async'
import User from '../models/user-model'

import { dbConnect } from '../lib/db-utils'
import { responseSender } from '../lib/controller-utils'

export const createUser = catchAsync(async (req, res) => {
	console.log('Creating user...')
	await dbConnect()
	const userOptions = { ...req.body, regMethod: req.body.regMethod || 'credentials' }

	await User.create(userOptions)

	responseSender(res, 201, { success: true })
})
