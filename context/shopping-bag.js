import { createContext, useState, useEffect, useContext } from 'react'
import NotificationContext from './notification'

const ShoppingItemsContext = createContext({
  items: Array,
  addToBag: function (itemSlug) {},
  removeFromBag: function (itemSlug) {},
})

const getIndexOfItemSlug = function (arr, match) {
  const slugArr = arr.map(item => item.slug)
  return slugArr.indexOf(match)
}

export const ShoppingItemsContextProvider = props => {
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

  const isSavedInBag = function (itemId) {
    return items.some(item => item._id === itemId)
  }

  const toggleAddAndRemoveFromBag = function (isInBag, itemSlug, fn) {
    if (isInBag) {
      return () => deleteItemBySlug(itemSlug)
    }

    return fn
  }

  const addItemToBag = function (item) {
    setItems(prevItems => {
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

  const deleteItemBySlug = function (itemSlug) {
    setItems(prevItems => {
      const itemsArray = [...prevItems]

      const slugIndex = getIndexOfItemSlug(itemsArray, itemSlug)

      if (slugIndex > -1) {
        itemsArray.splice(slugIndex, 1)

        return itemsArray
      }
    })

    showNotification('Removed from cart successfully').success()
  }

  const contextValue = {
    items,
    isItems,
    isSavedInBag,
    addToBag: addItemToBag,
    toggleAddAndRemove: toggleAddAndRemoveFromBag,
    removeFromBag: deleteItemBySlug,
  }

  return (
    <ShoppingItemsContext.Provider value={contextValue}>
      {props.children}
    </ShoppingItemsContext.Provider>
  )
}

export default ShoppingItemsContext
