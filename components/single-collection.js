import CollectionItemsGrid from './collections/collection-items-grid'
import classes from './css-modules/single-collection.module.css'

const SingleCollectionPage = (props) => {
	const { markdown } = props

	return (
		<section className={classes.contianer}>
			<h1 className={classes.title}>{markdown.data.title} Collection</h1>
			<p className={classes.summary}>{markdown.data.summary}</p>
			<div className={classes.content}>
				<CollectionItemsGrid items={props.products} />
			</div>
		</section>
	)
}

export default SingleCollectionPage
