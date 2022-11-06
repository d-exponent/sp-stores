import handler from '../../../../controllers/app-controller'
import { forgotPassword } from '../../../../controllers/auth-controller'

handler.post(forgotPassword)

export default handler
