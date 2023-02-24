import nextConnect from 'next-connect'
import getNextConnectConfiq from '../../../lib/next-connect'
import {
  createProduct,
  getProducts,
  imageResizeHandler,
  imageUploadHandler,
  setProductFeilds,
} from '../../../controllers/product-controller'

const handler = nextConnect(getNextConnectConfiq())

handler.get(getProducts)

handler
  .use(imageUploadHandler)
  .use(imageResizeHandler)
  .use(setProductFeilds)
  .post(createProduct)

// Disallow body parsing, consume as stream
export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
