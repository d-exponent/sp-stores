import Product from '../../models/product-model'
import SingleProduct from '../../components/single-product'

import { purify } from '../../lib/utils'
import { redirectToPage } from '../../lib/controller-utils'
import { dbConnect } from '../../lib/db-utils'

const ProductPage = props => <SingleProduct {...props} />

export const getStaticProps = async context => {
  const { slug } = context.params

  try {
    await dbConnect()

    const product = await Product.findOne({ slug }).populate('reviews')

    if (!product) throw ''

    return { props: { product: purify(product) } }
  } catch (error) {
    return redirectToPage()
  }
}

export const getStaticPaths = async () => {
  await dbConnect()

  const allProducts = await Product.find()

  const pathsWithSlug = purify(allProducts).map(product => ({
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
