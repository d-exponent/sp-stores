import Product from '../../models/product-model'
import SingleProduct from '../../components/single-product'
import { dbConnect } from '../../lib/db-utils'
import { purify } from '../../lib/utils'

const ProductPage = (props) => {
	return <SingleProduct {...props} />
}

export async function getStaticProps(context) {
	const { slug } = context.params
	try {
		await dbConnect()
		const results = await Product.findOne({ slug })

		if (!results) {
			return {
				redirect: {
					destination: '/',
				},
			}
		}
		
		return {
			props: { product: purify(results) },
		}
	} catch (error) {
		return {
			redirect: {
				destination: '/',
			},
		}
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
