import ProductModel from '../models/product-model'
import SingleCollection from '../components/single-collection'
import { purify } from '../lib/utils'
import { getCollectionDatafromSlug } from '../lib/collection-utils'
import { dbConnect } from '../lib/db-utils'

const CollectionPage = (props) => {
	return <SingleCollection {...props} />
}

export async function getServerSideProps(context) {
	const { cname } = context.params
	const markdownData = getCollectionDatafromSlug(cname)

	try {
		await dbConnect()

		const docs = await ProductModel.find({ category: cname })

		if (!docs) return { notFound: true }

		return {
			props: {
				products: purify(docs),
				markdown: purify(markdownData),
			},
		}
	} catch (error) {
		return { notFound: true }
	}
}

export default CollectionPage
