import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Absolute path to the collections directory
const collectionDirectory = path.join(process.cwd(), 'collections')

/** Extract meta data and content from markdown file */
export function getMarkdownDataFromFile(filePath) {
	const fileData = fs.readFileSync(filePath, 'utf-8')
	const { data, content } = matter(fileData)
	const fileMetaDataAndContent = { data, content }

	return fileMetaDataAndContent
}

// Returns an array of data and content objects from markdown files in the collections directory
export function getAllCollectionDirectoryData() {
	const files = fs.readdirSync(collectionDirectory, 'utf-8')

	// Extract data from markdown files
	const markdownDataArr = files.map((file) => {
		const filePath = path.join(collectionDirectory, file)
		return getMarkdownDataFromFile(filePath)
	})

	return markdownDataArr
}

// Returns the markdown data object with matching data.slug value
export function getCollectionDatafromSlug(slug) {
	const collectionDataArr = getAllCollectionDirectoryData()
	const targetMarkdownDataObj = collectionDataArr.find(
		(collection) => collection.data.slug === slug
	)

	return targetMarkdownDataObj
}
