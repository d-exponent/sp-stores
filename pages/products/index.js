import Product from '../../models/product-model'

import { dbConnect } from '../../lib/db-utils'
import { redirectToPage } from '../../lib/controller-utils'
import { purify } from '../../lib/utils'
import { revalidateTimer } from '../../lib/props-utils'
import _ from 'lodash'

import AllProducts from '../../components/all-products'

const Products = props => <AllProducts {...props} />

export const getStaticProps = async () => {
  try {
    await dbConnect()
    const products = await Product.find({ inStock: true })

    if (!products) throw ''

    const shuffledProducts = _.shuffle(purify(products))

    return {
      props: { products: shuffledProducts },
      revalidate: revalidateTimer,
    }
  } catch (e) {
    return redirectToPage()
  }
}

export default Products
