import Product from '../../models/product-model'
import { dbConnect } from '../../lib/db-utils'
import { redirectToPage } from '../../lib/controller-utils'
import { purify } from '../../lib/utils'
import _ from 'lodash'

import AllProducts from '../../components/all-products'

const Products = (props) => {
	return <AllProducts {...props} />
}

export async function getStaticProps() {


	try {
		await dbConnect()
		const products = await Product.find({ inStock: true })

		if (!products) {
			throw new Error('Error')
		}

		const shuffledProducts = _.shuffle(purify(products))

		return {
			props: { products: shuffledProducts },
			revalidate: 1,
		}
	} catch (e) {
		return redirectToPage()
	}
}

export default Products
