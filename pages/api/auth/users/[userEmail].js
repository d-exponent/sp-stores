import { getMe } from '../../../../controllers/user-controller'
import { updatePassword } from '../../../../controllers/auth-controller'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'
import catchAsync from '../../../../lib/catch-async'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      await getMe(req, res)
      break

    case 'PATCH':
      await updatePassword(req, res)
      break

    default:
      sendMethodNotAllowedResponse(res, method)
      break
  }
}

export default catchAsync(handler)
