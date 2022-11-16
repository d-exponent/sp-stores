import ProductModel from '../../models/product-model'
import { dbConnect } from '../../lib/db-utils'
import { purify } from '../../lib/utils'
import _ from 'lodash'

import AllProducts from '../../components/all-products'

const Products = (props) => {
	return <AllProducts {...props} />
}

export async function getStaticProps() {
	const redirect = () => ({
		redirect: {
			destination: '/',
		},
	})

	try {
		await dbConnect()
		const products = await ProductModel.find({})

		if (!products) {
			return redirect()
		}

		const shuffledProducts = _.shuffle(purify(products))
		
		return {
			props: { products: shuffledProducts },
			revalidate: 1,
		}
	} catch (e) {
		return redirect()
	}
}

export default Products
