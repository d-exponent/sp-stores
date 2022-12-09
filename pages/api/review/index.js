import handler from '../../../controllers/app-controller'
import Review from '../../../models/review-model'
import factory from '../../../controllers/handler-factory'

handler
    .get(factory.getAll(Review))
    .post(factory.createOne(Review))

export default handler
