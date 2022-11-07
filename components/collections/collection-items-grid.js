import ItemCard from '../cards/item'
import classes from './collection-items-grid.module.css'

const CollectionItemsGrid = ({ items }) => {
	
	return <div className={classes.grid}>{items.map((item) => (
		<ItemCard
			key={item._id}
			product={item}
		/>
	))}</div>
}

export default CollectionItemsGrid
