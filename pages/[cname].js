import ProductModel from '../models/product-model'
import SingleCollection from '../components/single-collection'
import { purify } from '../lib/utils'
import {
	getCollectionDatafromSlug,
	getAllCollectionDirectoryData,
} from '../lib/collection-utils'
import { dbConnect } from '../lib/db-utils'

const CollectionPage = (props) => {
	return <SingleCollection {...props} />
}

export async function getStaticProps(context) {
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
		console.log(error.message)
		return { notFound: true }
	}
}

export async function getStaticPaths() {
	const markdownCollectionData = getAllCollectionDirectoryData()

	const pathsWithSlug = markdownCollectionData.map((collection) => ({
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
