import handler from '../../../controllers/app-controller'
import Order from '../../../models/order-model'
import factory from '../../../controllers/handler-factory'

handler
    .get(factory.getAll(Order))
    .post(factory.createOne(Order))

export default handler
