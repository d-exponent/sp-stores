import handler from '../../../controllers/app-controller'
import Order from '../../../models/order-model'
import factory from '../../../controllers/handler-factory'

handler
	.use(factory.setId('orderId'))
	.get(factory.getOne(Order))
	.patch(factory.updateOne(Order))
	.delete(factory.deleteOne(Order))

export default handler
