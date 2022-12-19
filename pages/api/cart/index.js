import handler from '../../../controllers/app-controller'
import factory from '../../../controllers/handler-factory'
import Cart from '../../../models/cart-model'

handler
    .get(factory.getAll(Cart))
    .post(factory.createOne(Cart))

export default handler
