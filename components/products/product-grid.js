import Item from '../cards/item'
import classes from './product-grid.module.css'

const Products = (props) => {
	const productCards = props.products.map((product) => (
		<Item key={product._id} product={product} />
	))
	return (
		<section className={classes.container}>
			<h1>Samples</h1>
			<div className={classes.cardsGrid}>{productCards}</div>
		</section>
	)
}

export default Products
