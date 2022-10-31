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

export const getItemsIds = (items) => {
	return items.map((item) => item._id)
	
}
