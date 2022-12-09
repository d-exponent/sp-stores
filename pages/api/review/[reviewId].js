import handler from '../../../controllers/app-controller'
import Review from '../../../models/review-model'
import factory from '../../../controllers/handler-factory'

handler
	.use(factory.setId('reviewId'))
	.get(factory.getOne(Review))
	.patch(factory.updateOne(Review))
	.delete(factory.deleteOne(Review))

export default handler
