import handler from '../../../controllers/app-controller'
import { createCheckoutSession } from '../../../controllers/paystack-controller'

handler.post(createCheckoutSession)

export default handler
