import { withFetch } from '../lib/auth-utils'

export const fetchAll = (baseUrl) => 
    withFetch({ url: baseUrl })

export const fetchOne = (baseUrl, itemId) => 
    withFetch({ url: `${baseUrl}/${itemId}` })

export const fetchByQuery = (baseUrl, query) => 
    withFetch({ url: `${baseUrl}?${query}` })
