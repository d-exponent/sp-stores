import handler from '../../../controllers/app-controller'
import factory from '../../../controllers/handler-factory'
import { setProductFeilds } from '../../../middlewares/product'
import Product from '../../../models/product-model'
import imageUploadHandler from '../../../middlewares/multer'
import imageResizeHandler from '../../../middlewares/sharp'

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
}

handler
	.get(factory.getAll(Product))
	.use(imageUploadHandler)
	.use(imageResizeHandler)
	.post(setProductFeilds, factory.createOne(Product))

export default handler
