import nextConnect from 'next-connect'

import getNextConnectConfiq from '../../../../lib/next-connect'
import {
  getMe,
  updateMe,
  deleteMe,
} from '../../../../controllers/user-controller'

const handler = nextConnect(getNextConnectConfiq())

handler.get(getMe)
handler.patch(updateMe)
handler.delete(deleteMe)

export default handler
