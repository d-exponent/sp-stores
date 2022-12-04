import handler from '../../../controllers/app-controller'
import { getReview } from '../../../controllers/review-controller'

handler.get(getReview)

export default handler
