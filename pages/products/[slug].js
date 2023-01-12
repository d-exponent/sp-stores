import Product from '../../models/product-model'
import SingleProduct from '../../components/single-product'

import { dbConnect } from '../../lib/db-utils'
import { purify } from '../../lib/utils'
import { redirectToPage } from '../../lib/controller-utils'

const ProductPage = (props) => <SingleProduct {...props} />

export const getStaticProps = async (context) => {
	const { slug } = context.params

	try {
		await dbConnect()

		const result = await Product.findOne({ slug }).populate('reviews')

		if (!result) throw ''

		return { props: { product: purify(result) } }
	} catch (error) {
		return redirectToPage()
	}
}

export const getStaticPaths = async () => {
	await dbConnect()

	const allProducts = await Product.find().exec()

	const pathsWithSlug = purify(allProducts).map((product) => ({
		params: {
			slug: product.slug,
		},
	}))

	return {
		paths: pathsWithSlug,
		fallback: 'blocking',
	}
}

export default ProductPage
