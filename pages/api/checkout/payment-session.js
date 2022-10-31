import handler from '../../../controllers/app-controller'
import { createSession } from '../../../controllers/paystack-controller'

handler.post(createSession)

export default handler
