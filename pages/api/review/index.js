import handler from '../../../controllers/app-controller'
import { createReview, getReviews } from '../../../controllers/review-controller'


handler.post(createReview)
handler.get(getReviews)

export default handler
