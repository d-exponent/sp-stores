
import Hero from './layout/hero'
import CollectionGrid from './collections/collections-grid'
import ProductGrid from './products/product-grid'
import classes from './css-modules/home.module.css'

const HomePage = (props) => {

	return (
		<div className={classes.container}>
			<>
				<Hero />
				{props.collections ? <CollectionGrid collections={props.collections} /> : null}
				<ProductGrid products={props.products} />
			</>
		</div>
	)
}

export default HomePage
