import { createContext, useState, useEffect } from 'react'

const ShoppingItemsContext = createContext({
	items: Array,
	addToBag: function (itemSlug) {},
	removeFromBag: function (itemSlug) {},
})

export const ShoppingItemsContextProvider = (props) => {
	const localStorageKey = 'bagItems'
	const [items, setItems] = useState([])
	const [isItems, setIsItems] = useState(false)

	useEffect(() => {
		const storedItems = JSON.parse(localStorage.getItem(localStorageKey))
		if (storedItems) setItems(storedItems)
	}, [])

	useEffect(() => {
		if (items.length) {
			localStorage.setItem(localStorageKey, JSON.stringify(items))
			return setIsItems(true)
		}

		setIsItems(false)
	}, [items])

	async function addItemToBag(product) {
		//check if item is already in items array
		const isInItems = items.some((item) => item.slug === product.slug)
		if (isInItems) return

		//Add product to state
		setItems((prevItems) => [product, ...prevItems])
	}

	function deleteItemBySlug(itemSlug) {
		setItems((prevItems) => {
			const itemsArray = [...prevItems]

			const itemsSlug = itemsArray.map((item) => item.slug)
			const slugIndex = itemsSlug.indexOf(itemSlug)

			//Remove the item only when it's found
			if (slugIndex > -1) {
				itemsArray.splice(slugIndex, 1)
			}

			//Return new copy to state
			return itemsArray
		})
	}

	const contextValue = {
		items: items,
		isItems,
		addToBag: addItemToBag,
		removeFromBag: deleteItemBySlug,
	}

	return (
		<ShoppingItemsContext.Provider value={contextValue}>
			{props.children}
		</ShoppingItemsContext.Provider>
	)
}

export default ShoppingItemsContext
