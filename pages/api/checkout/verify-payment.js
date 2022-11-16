import handler from '../../../controllers/app-controller'
import { verifyPayment } from '../../../controllers/paystack-controller'

handler.get(verifyPayment)

export default handler
