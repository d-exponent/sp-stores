import handler from '../../../controllers/app-controller'
import Review from '../../../models/review-model'
import factory from '../../../controllers/handler-factory'

handler.use(factory.setId('reviewId'))
handler.get(factory.getOne(Review, ))
handler.patch(factory.updateOne(Review, 'calculateRatinsStats'))
handler.delete(factory.deleteOne(Review, 'calculateRatinsStats'))

export default handler
