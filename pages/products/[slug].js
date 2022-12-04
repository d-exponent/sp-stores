import Product from '../../models/product-model'
import SingleProduct from '../../components/single-product'
import { dbConnect } from '../../lib/db-utils'
import { purify } from '../../lib/utils'
import { redirectToPage } from '../../lib/controller-utils'

const ProductPage = (props) => {
	return <SingleProduct {...props} />
}

export async function getStaticProps(context) {
	const { slug } = context.params

	const redirect = redirectToPage('/products')

	try {
		await dbConnect()
		const result = await Product.findOne({ slug })
			.populate('reviews')
			.exec()

		if (!result) {
			return redirect
		}

		const product = purify(result)

		return {
			props: { product },
		}
	} catch (error) {
		return redirect
	}
}

export async function getStaticPaths() {
	await dbConnect()

	const allProducts = await Product.find({})

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
