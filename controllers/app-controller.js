import nextConnect from 'next-connect'

import handleError from './error-controller'
import logger from '../middlewares/logger'
import { dbConnect } from '../lib/db-utils'

const handler = nextConnect({
	onNoMatch: (req, res) => {
		res
			.status(400)
			.json({ success: false, message: `${req.method} method not allowed on this route` })
	},
	onError: handleError,
})

if (process.env.NODE_ENV !== 'production') {
	handler.use(logger)
}

dbConnect()
	.then(() => {
		if (process.env.NODE_ENV !== 'production') {
			console.log('Connected to database successfully 👍')
		}
	})
	.catch((err) => {
		console.log('🧰 Error connecting to database' + err.message)
	})

export default handler
