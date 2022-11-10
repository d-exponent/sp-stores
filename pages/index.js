import Home from '../components/home'
import Product from '../models/product-model'
import { getAllCollectionDirectoryData } from '../lib/collection-utils'
import { getDocumentsByGroups } from '../lib/controller-utils'

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
		const groupedDocs = await getDocumentsByGroups(Product, 'category')

		return {
			props: {
				collections: collectionMetaData,
				groups: groupedDocs,
			},
		}
	} catch (e) {
		return {
			props: {
				collections: collectionMetaData,
			},
		}
	}
}
