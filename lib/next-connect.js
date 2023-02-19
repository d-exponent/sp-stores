import { sendResponse } from './controller-utils'

import {
	handleMongooseDuplicateError,
	handleMongooseValidationError,
	sendProdError,
} from '../controllers/error-controller'
import { isProductionEnv, sendMethodNotAllowedResponse } from './controller-utils'
import { purify } from './utils'

const getNextConnectConfiq = () => ({
	onNoMatch: (req, res) => {
		sendMethodNotAllowedResponse(res, req.method)
	},

	onError: (err, _, res, next) => {
		const error = {
			...purify(err),
			name: err.name,
			errors: err.errors,
			stack: err.stack,
			message: err.message,
			status: err.status || 500,
		}

		if (error.code === 11000) {
			error = handleMongooseDuplicateError(error)
		}

		if (error.name === 'ValidationError') {
			error = handleMongooseValidationError(error)
		}

		isProductionEnv()
			? sendProdError(res, error)
			: sendResponse(res, error.status, {
					success: false,
					message: error.message,
					err,
			  })

		next()
	},
})
    


export default getNextConnectConfiq