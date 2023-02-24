import { fetchAll, fetchByQuery, fetchOne } from './fetcher-factory'

const BASE_PRODUCTS_URL = '/api/products'

export const fetchProduct = productId =>
  fetchOne(BASE_PRODUCTS_URL, productId)

export const fetchProducts = () => fetchAll(BASE_PRODUCTS_URL)

export const fetchProductsByQuery = queryString =>
  fetchByQuery(BASE_PRODUCTS_URL, queryString)
