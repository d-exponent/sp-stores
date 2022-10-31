import ItemCard from './cards/item'
import classes from './css-modules/products.module.css'

const AllProductsPage = (props) => {
	const productsCardsEl = props.products.map((product) => (
		<ItemCard key={product._id} product={product} favorite={true} purchase={true} />
	))

	return (
		<section>
			<h1>Happy Shopping</h1>
			{productsCardsEl}
		</section>
	)
}

export default AllProductsPage
