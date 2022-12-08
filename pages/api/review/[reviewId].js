import handler from '../../../controllers/app-controller'
import Review from '../../../models/review-model'
import Product from '../../../models/product-model'
import factory from '../../../controllers/handler-factory'
import mongoose from 'mongoose'

handler.use(factory.setId('reviewId'))
handler.get(factory.getOne(Review))
handler.patch(factory.updateOne(Review, 'calculateRatinsStats'))
handler.delete(factory.deleteOne(Review, 'calculateRatinsStats'))

export default handler
