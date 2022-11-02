import Home from '../components/home'
import removePaystackRef from '../middlewares/remove-pasystack-ref'
import { getAllCollectionDirectoryData } from '../lib/collection-utils'
import { getProductsByCategory } from '../lib/db-utils'

export default function HomePage(props) {
	return <Home {...props} />
}

export const getServerSideProps = removePaystackRef(async () => {
	//Get markdown data for  collections
	const markdownDataObj = getAllCollectionDirectoryData()
	const collectionMetaData = markdownDataObj.map((result) => result.data)

	try {
		//Get the documents in each Products collection category
		const groupedDocs = await getProductsByCategory()

		if (!groupedDocs) return { notFound: true }

		//Lets get one random item from each category
		const randomItemsByCategory = groupedDocs.map((doc) => {
			const collectionDocs = doc.group
			const randomIndex = Math.floor(Math.random() * collectionDocs.length)
			const randomItem = collectionDocs[randomIndex]
			return randomItem
		})

		return {
			props: {
				collections: collectionMetaData,
				products: randomItemsByCategory,
			},
		}
	} catch (e) {
		return { notFound: true }
	}
})
