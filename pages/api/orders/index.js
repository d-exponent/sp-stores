import handler from '../../../controllers/app-controller'
import { getAllOrders, createOrder } from '../../../controllers/order-controller'

handler.get(getAllOrders)
handler.post(createOrder)

export default handler
