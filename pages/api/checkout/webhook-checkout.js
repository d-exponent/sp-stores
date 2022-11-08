import handler from '../../../controllers/app-controller'
import { webhook_checkout } from '../../../controllers/paystack-controller'

handler.post(webhook_checkout)

export default handler
