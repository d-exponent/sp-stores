import CollectionItemsGrid from './collections/collection-items-grid'
import classes from './css-modules/single-collection.module.css'

const SingleCollectionPage = (props) => {
	const { markdown, products } = props

	return (
		<section className={classes.contianer}>
			<div className={`${classes.gridItems} grid`}>
				<CollectionItemsGrid items={products} itemUseShadow='box-shadow-light' />
			</div>

			<div className={classes.summary}>
				<p>{markdown.data.summary}</p>
			</div>
		</section>
	)
}

export default SingleCollectionPage
