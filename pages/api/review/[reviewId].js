import handler from '../../../controllers/app-controller'
import { getReviewById } from '../../../controllers/review-controller'

handler.get(getReviewById)

export default handler
