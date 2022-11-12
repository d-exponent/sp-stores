import CollectionItemsGrid from './collections/collection-items-grid'
import classes from './css-modules/single-collection.module.css'

const SingleCollectionPage = (props) => {
	const { markdown, products } = props

	return (
		<section className={`${classes.container} pd-top-30`}>
			<div className={classes.gridItems}>
				<CollectionItemsGrid items={products} />
			</div>

			<div className={classes.summary}>
				<p>{markdown.data.summary}</p>
			</div>
		</section>
	)
}

export default SingleCollectionPage
