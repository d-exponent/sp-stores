import Hero from './layout/hero'
import CollectionGrid from './collections/collections-grid'
import CollectionItemsGrid from './collections/collection-items-grid'
import classes from './css-modules/home.module.css'

const HomePage = (props) => {
	return (
		<div className={classes.container}>
			<>
				<Hero />
				<CollectionGrid collections={props.collections} />
			</>
			<div className={classes.productsGrid}>
				<CollectionItemsGrid items={props.products} />
			</div>
		</div>
	)
}

export default HomePage
