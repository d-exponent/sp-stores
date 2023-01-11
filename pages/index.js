import Home from '../components/home'
import Product from '../models/product-model'
import { getAllCollectionDirectoryData } from '../lib/collection-utils'
import { dbConnect } from '../lib/db-utils'
import { purify } from '../lib/utils'

export default function HomePage(props) {
	return <Home {...props} />
}

export const getStaticProps = async () => {
	//Get markdown data for  collections
	const markdownDataObj = getAllCollectionDirectoryData()
	const collectionMetaData = markdownDataObj.map((result) => result.data)

	try {
		await dbConnect()

		const groupedByCategory = await Product.aggregate([
			{
				$group: {
					_id: `$category`,
					group: { $push: '$$ROOT' },
				},
			},
		])

		return {
			props: {
				collections: collectionMetaData,
				groups: purify(groupedByCategory),
			},
			revalidate: 60,
		}
	} catch (e) {
		return {
			props: {
				collections: collectionMetaData,
			},
		}
	}
}
