/**
 *
 * @param {object[]} items an array of objects containing the price infomation of product items
 * @returns {number} the sum of the prices of the products
 */
export const getCheckoutPrice = (items) => {
	let checkoutPrice = 0
	items.forEach((item) => {
		checkoutPrice += item.cart.amount
	})

	return checkoutPrice
}

/**
 *
 * @param {object[]} items An array of mongoDB objects with and _id feild
 * @returns {object[]}
 */
export const getCartItems = (items) => {
	const cartItems = items.map((item) => ({
		productId: item._id,
		productName: item.name,
		brand: item.brand,
		paidAmount: item.cart.amount,
		salesQuantity: item.cart.quantity,
		itemSize: item.cart.size,
		coverImage: item.imageCover,
		itemPrice: item.discountPrice || item.price,
	}))

	return cartItems
}
