import handler from '../../../controllers/app-controller'
import handleError from '../../../controllers/error-controller'
import { webhook_checkout } from '../../../controllers/paystack-controller'

handleError.post(webhook_checkout)

export default handler
