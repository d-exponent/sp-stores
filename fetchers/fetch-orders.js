
import { fetchAll, fetchByQuery, fetchOne } from './fetcher-factory'

const BASE_ORDERS_URL = '/api/orders'

export const fetchOrders = () => 
    fetchAll(BASE_ORDERS_URL)

export const fetchOrder = (orderId) =>
    fetchOne(BASE_ORDERS_URL, orderId)

export const fetchOrdersByQuery = (queryString) => 
    fetchByQuery(BASE_ORDERS_URL, queryString)


