import Hero from './layout/hero'
import CollectionsGrid from './collections/collections-grid'
import CollectionItemsGrid from './collections/collection-items-grid'
import classes from './css-modules/home.module.css'

const HomePage = (props) => {
	return (
		<div className={classes.container}>
			<>
				<Hero />
				<CollectionsGrid collections={props.collections} />
			</>
			<div className={classes.productsGrid}>
				<CollectionItemsGrid items={props.products} showToCollections={true} />
			</div>
		</div>
	)
}

export default HomePage
