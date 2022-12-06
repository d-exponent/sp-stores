import nextConnect from 'next-connect'
import morgan from 'morgan'


import handleError from './error-controller'
import { sendResponse, isProductionEnv } from '../lib/controller-utils'
import { dbConnect } from '../lib/db-utils'

const handleNoMatch = (req, res) => {
	sendResponse(res, 400, {
		success: false,
		message: `${req.method} method not allowed on this route`,
	})
}

const connectDb = async (req, res, next) => {
	await dbConnect()
	next()
}

const handler = nextConnect({
	onNoMatch: handleNoMatch,
	onError: handleError,
})

handler.use(connectDb)


!isProductionEnv() && handler.use(morgan('dev'))



export default handler
