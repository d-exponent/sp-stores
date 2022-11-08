import Home from '../components/home'
import { getAllCollectionDirectoryData } from '../lib/collection-utils'
import { getProductsByCategory } from '../lib/controller-utils'

export default function HomePage(props) {
	return <Home {...props} />
}

export const getServerSideProps = async (context) => {
	const {
		req: { url },
	} = context

	const trxrefReg = /trxref/
	const referenceReg = /reference/

	// Remove Paystack query reference string from the url
	if (trxrefReg.test(url) && referenceReg.test(url)) {
		return {
			redirect: {
				destination: '/',
			},
		}
	}

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
}
