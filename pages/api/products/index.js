import handler from '../../../controllers/app-controller'
import imageUploadHandler from '../../../middlewares/multer'
import imageResizeHandler from '../../../middlewares/sharp'
import { getAllProducts, createProduct } from '../../../controllers/product-controller'

handler
	.get(getAllProducts)
	.use(imageUploadHandler)
	.post(imageResizeHandler(createProduct))

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
}

export default handler
