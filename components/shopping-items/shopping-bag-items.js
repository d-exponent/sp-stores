import { useContext } from 'react'

import ShoppingItemsContext from '../../context/shopping-bag'
import BagItemsWrapper from './bag-items-wrapper'
import EmptyItemsWrapper from './empty-items-wrapper'

import classes from './css-modules/shopping-bag-items.module.css'

export default function ShoppingBagItems() {
  const { isItems } = useContext(ShoppingItemsContext)

  return (
    <section className={classes.container}>
      {!isItems ? <EmptyItemsWrapper /> : null}
      {isItems ? <BagItemsWrapper /> : null}
    </section>
  )
}
