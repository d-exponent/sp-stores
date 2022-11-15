/**
 *
 * @param {object[]} items an array of objects containing the price infomation of product items
 * @returns {number} the sum of the prices of the products
 */
export const getCheckoutPrice = (items) => {
	let checkoutPrice = 0
	items.forEach((item) => {
		if (item.discountPrice) {
			checkoutPrice += item.discountPrice
			return
		}

		checkoutPrice += item.price
	})

	return checkoutPrice
}

/**
 *
 * @param {object[]} items An array of mongoDB objects with and _id feild
 * @returns {string[]} arrays of id strings
 */
export const getItemsIds = (items) => {
	return items.map((item) => item._id)
}
