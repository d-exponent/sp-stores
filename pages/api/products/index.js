import handler from '../../../controllers/app-controller'
import imageUploadHandler from '../../../middlewares/multer'
import imageResizeHandler from '../../../middlewares/sharp'
import { getAllProducts, createProduct } from '../../../controllers/product-controller'


export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
}


handler
	.get(getAllProducts)
	.use(imageUploadHandler)
	.use(imageResizeHandler)
	.post(createProduct)


export default handler
