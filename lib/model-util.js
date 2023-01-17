export const getQuantityFromSizes = (sizes) => {
	
	if (!sizes || !Array.isArray(sizes) || sizes.length < 1) return 0

	const quantity = sizes.map((size) => size.quantity).reduce((sum, total) => sum + total)

	return quantity
}

export const setInstock = (quantity) => quantity > 0
