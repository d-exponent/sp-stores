import nextConnect from 'next-connect'
import handleError from './error-controller'
import logger from '../middlewares/logger'

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

export default handler
