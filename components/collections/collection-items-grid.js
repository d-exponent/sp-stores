import ItemCard from '../cards/item'
import classes from './collection-items-grid.module.css'

const CollectionItemsGrid = ({ items }) => {
	const itemsCardsEl = items.map((item) => (
		<ItemCard
			key={item._id}
			product={item}
			favorite={true}
			purchase={true}
			showPrice={true}
		/>
	))
	return <div className={classes.container}>{itemsCardsEl}</div>
}

export default CollectionItemsGrid
