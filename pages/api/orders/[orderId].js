import handler from '../../../controllers/app-controller'
import { getOrderById } from '../../../controllers/order-controller'

handler.get(getOrderById)

export default handler
