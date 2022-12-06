import handler from '../../../controllers/app-controller'
import Order from '../../../models/order-model'
import factory from '../../../controllers/handler-factory'

handler.use(factory.setId('orderId'))
handler.get(factory.getOne(Order))
handler.patch(factory.updateOne(Order))
handler.delete(factory.deleteOne(Order))

export default handler
