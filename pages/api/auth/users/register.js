import handler from '../../../../controllers/app-controller'
import { createUser } from '../../../../controllers/auth-controller'

handler.post(createUser)

export default handler
