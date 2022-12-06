import handler from '../../../../controllers/app-controller'
import factory from '../../../../controllers/handler-factory'
import User from '../../../../models/user-model'

handler.get(factory.getAll(User))
handler.post(factory.createOne(User))

export default handler
