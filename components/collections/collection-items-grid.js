import ItemCard from '../cards/item'
import classes from './collection-items-grid.module.css'

const CollectionItemsGrid = (props) => {
	return (
		<div className={classes.grid}>
			{props.items.map((item) => (
				<ItemCard
					key={item._id}
					product={item}
					showToCollections={props.showToCollections}
				/>
			))}
		</div>
	)
}

export default CollectionItemsGrid
