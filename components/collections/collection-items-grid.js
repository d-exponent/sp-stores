import ItemCard from '../cards/item'
import classes from './collections-items-grid.module.css'

const CollectionItemsGrid = (props) => {
	return (
		<div className={classes.container}>
			{props.items.map((item) => (
				<ItemCard
					key={item._id}
					product={item}
					showToCollections={props.showToCollections}
					useBoxShadow={props.itemUseShadow}
					toBag={props.itemShowToBag}
				/>
			))}
		</div>
	)
}

export default CollectionItemsGrid
