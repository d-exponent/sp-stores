import handler from '../../../../controllers/app-controller'
import { getUser } from '../../../../controllers/user-controller'
import { updatePassword } from '../../../../controllers/auth-controller'

handler.get(getUser)
handler.patch(updatePassword)

export default handler
