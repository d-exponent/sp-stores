import ItemCard from './cards/item'
import classes from './css-modules/products.module.css'

const AllProductsPage = ({ products }) => {
	return (
		<section>
			<h1>Happy Shopping</h1>
			{products?.map((product) => (
				<ItemCard key={product._id} product={product} favorite={true} purchase={true} />
			))}
			{!products ? <p>Something went wrong</p> : null}
		</section>
	)
}

export default AllProductsPage
