import ProductModel from '../../models/product-model'
import SingleProduct from '../../components/single-product'
import { dbConnect } from '../../lib/db-utils'
import { purify } from '../../lib/utils'

const ProductPage = (props) => {
	return <SingleProduct {...props} />
}

export async function getServerSideProps(context) {
	const { slug } = context.params
	try {
		await dbConnect()
		const results = await ProductModel.findOne({ slug })

		if (!results) return { notFound: true }

		return {
			props: { product: purify(results) },
		}
	} catch (error) {
		return { notFound: true }
	}
}

export default ProductPage
