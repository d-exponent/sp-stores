import handler from '../../../controllers/app-controller'
import { verifyCheckout } from '../../../controllers/paystack-controller'

handler.get(verifyCheckout)

export default handler
