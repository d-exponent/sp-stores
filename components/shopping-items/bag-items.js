import { useContext } from 'react'

import ShoppingBagItem from '../cards/shopping-bag-item'
import ShoppingItemsContext from '../../context/shopping-bag'

import classes from './css-modules/bag-items.module.css'

const BagItems = () => {
	const { items, removeFromBag } = useContext(ShoppingItemsContext)
	return (
		<ul className={classes.itemsList}>
			{items.map((item) => {
				const imagePath = `/images/products/${item.imageCover}`
				const customProps = {
					...item,
					imagePath,
					handleCta: () => removeFromBag(item.slug),
				}
				return <ShoppingBagItem key={item.slug} {...customProps} />
			})}
		</ul>
	)
}

export default BagItems
