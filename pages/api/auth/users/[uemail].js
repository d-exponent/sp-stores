import handler from '../../../../controllers/app-controller'
import { getUser } from '../../../../controllers/user-controller'

handler.get(getUser)

export default handler
