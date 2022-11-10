import ItemCard from '../cards/item'

const CollectionItemsGrid = (props) => {
	return (
		<div>
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
