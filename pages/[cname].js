import Product from '../models/product-model'
import SingleCollection from '../components/single-collection'
import { purify } from '../lib/utils'
import {
  getCollectionDatafromSlug,
  getAllCollectionDirectoryData,
} from '../lib/collection-utils'
import { dbConnect } from '../lib/db-utils'
import AppError from '../lib/app-error'

const CollectionPage = props => <SingleCollection {...props} />

export async function getStaticProps(context) {
  const { cname } = context.params
  const markdownData = getCollectionDatafromSlug(cname)

  try {
    await dbConnect()

    const docs = await Product.find({ category: cname })

    if (!docs) return { notFound: true }

    return {
      props: {
        products: purify(docs),
        markdown: purify(markdownData),
      },
    }
  } catch (e) {
    AppError.saveServerErrorToDatabase(e)
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  const markdownCollectionData = getAllCollectionDirectoryData()

  const pathsWithSlug = markdownCollectionData.map(collection => ({
    params: {
      cname: collection.data.slug,
    },
  }))

  return {
    paths: pathsWithSlug,
    fallback: 'blocking',
  }
}

export default CollectionPage
