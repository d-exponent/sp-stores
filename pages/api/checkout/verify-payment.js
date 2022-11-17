import handler from '../../../controllers/app-controller'
import { verifyPayment } from '../../../controllers/paystack-controller'

handler.post(verifyPayment)

export default handler
