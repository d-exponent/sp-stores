import CollectionCard from './collection-card'
import classes from './collection-grid.module.css'


const CollectionGrid = (props) => {
	const collectionCardsEl = props.collections.map((collection, i) => (
		<CollectionCard key={i} {...collection} />
	))
	return (
		<section className={classes.container}>
			<h2>Collections</h2>
			<div className={classes.cardsGrid}>{collectionCardsEl}</div>
		</section>
	)
}

export default CollectionGrid
