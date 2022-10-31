import handler from '../../../controllers/app-controller'
import { getProduct, updateProduct } from '../../../controllers/product-controller'

handler.get(getProduct)
handler.patch(updateProduct)

export default handler
