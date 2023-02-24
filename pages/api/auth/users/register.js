import { createUser } from '../../../../controllers/auth-controller'
import catchAsync from '../../../../lib/catch-async'
import { sendMethodNotAllowedResponse } from '../../../../lib/controller-utils'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      await createUser(req, res)
      break

    default:
      sendMethodNotAllowedResponse(res, req.method)
      break
  }
}

export default catchAsync(handler)
