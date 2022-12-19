import handler from '../../../controllers/app-controller'
import Product from '../../../models/product-model'
import factory from '../../../controllers/handler-factory'



handler
	.use(factory.setId('productId'))
	.get(factory.getOne(Product, 'reviews'))
	.patch(factory.updateOne(Product))
	.delete(factory.deleteOne(Product))

export default handler
