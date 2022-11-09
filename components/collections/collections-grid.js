import CollectionCard from './collection-card'
import classes from './collections-grid.module.css'

const CollectionGrid = (props) => {
	const collectionCardsEl = props.collections.map((collection) => {
		return <CollectionCard key={collection.slug} {...collection} />
	})
	return (
		<div className={classes.container}>
			<div className={classes.cardsGrid}>{collectionCardsEl}</div>
		</div>
	)
}

export default CollectionGrid
