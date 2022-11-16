import nextConnect from 'next-connect'

import handleError from './error-controller'
import logger from '../middlewares/logger'
import connectDb from '../middlewares/connect-db'
import { sendResponse } from '../lib/controller-utils'

const handleNoMatch = (req, res) => {
	sendResponse(res, 400, {
		success: false,
		message: `${req.method} method not allowed on this route`,
	})
}

const handler = nextConnect({
	onNoMatch: handleNoMatch,
	onError: handleError,
})

handler.use(connectDb)
handler.use(logger('dev'))

export default handler
