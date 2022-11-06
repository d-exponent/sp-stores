import handler from '../../../../controllers/app-controller'
import { resetPassword } from '../../../../controllers/auth-controller'

handler.patch(resetPassword)

export default handler
