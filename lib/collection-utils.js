import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Absolute path to the collections directory
const collectionDirectory = path.join(process.cwd(), 'collections')

/**
 *
 * @param {string} filePath
 * @returns {object}
 */
export const getMarkdownDataFromFile = filePath => {
  const fileData = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileData)
  const fileMetaDataAndContent = { data, content }

  return fileMetaDataAndContent
}

/**
 * @returns {object[]}
 */
export const getAllCollectionDirectoryData = () => {
  const files = fs.readdirSync(collectionDirectory, 'utf-8')

  // Extract data from markdown files
  const markdownDataArr = files.map(file => {
    const filePath = path.join(collectionDirectory, file)
    return getMarkdownDataFromFile(filePath)
  })

  return markdownDataArr
}

/**
 *
 * @param {string} slug
 * @returns {object}
 */
export const getCollectionDatafromSlug = slug => {
  const collectionDataArr = getAllCollectionDirectoryData()
  const targetMarkdownDataObj = collectionDataArr.find(
    collection => collection.data.slug === slug
  )

  return targetMarkdownDataObj
}
