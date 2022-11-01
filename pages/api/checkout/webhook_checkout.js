import handler from '../../../controllers/app-controller'
import { webhookCheckout } from '../../../controllers/paystack-controller'

handler.post(webhookCheckout)

export default handler
