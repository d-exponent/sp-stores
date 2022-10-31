import handler from '../../../../controllers/app-controller'
import { getUsers } from '../../../../controllers/user-controller'

handler.get(getUsers)

export default handler
