import handler from '../../../controllers/app-controller'
import { getOrder } from '../../../controllers/order-controller'

handler.get(getOrder)

export default handler
