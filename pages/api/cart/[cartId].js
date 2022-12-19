import handler from '../../../controllers/app-controller'
import factory from '../../../controllers/handler-factory'
import Cart from '../../../models/cart-model'

handler
	.use(factory.setId('cartId'))
	.post(factory.createOne(Cart))
	.get(factory.getOne(Cart))

export default handler
