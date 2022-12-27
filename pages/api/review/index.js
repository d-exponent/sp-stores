import handler from '../../../controllers/app-controller'
import factory from '../../../controllers/handler-factory'
import Review from '../../../models/review-model'

handler
    .get(factory.getAll(Review))
    .post(factory.createOne(Review))

export default handler
