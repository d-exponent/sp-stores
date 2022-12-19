import { createContext, useState, useEffect, useContext } from 'react'
import NotificationContext from './notification'

const ShoppingItemsContext = createContext({
	items: Array,
	addToBag: function (itemSlug) {},
	removeFromBag: function (itemSlug) {},
})

const getIndexOfItemSlug = (arr, match) => {
	const slugArr = arr.map((item) => item.slug)
	return slugArr.indexOf(match)
}

export const ShoppingItemsContextProvider = (props) => {
	const localStorageKey = 'bagItems'
	const [items, setItems] = useState([])
	const [isItems, setIsItems] = useState(false)

	const { showNotification } = useContext(NotificationContext)

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

	const addItemToBag = (item) => {
		setItems((prevItems) => {
			const slaveArr = [...prevItems]
			const isInItems = slaveArr.some(({ slug }) => slug === item.slug)

			if (isInItems) {
				const indexOfItem = getIndexOfItemSlug(slaveArr, item.slug)
				slaveArr[indexOfItem] = item
				return slaveArr
			}

			return [item, ...slaveArr]
		})

		showNotification('Added to cart successfully').success()
	}

	const deleteItemBySlug = (itemSlug) => {
		setItems((prevItems) => {
			const itemsArray = [...prevItems]

			const slugIndex = getIndexOfItemSlug(itemsArray, itemSlug)

			if (slugIndex > -1) {
				itemsArray.splice(slugIndex, 1)

				return itemsArray
			}
		})
	}

	const contextValue = {
		items,
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
