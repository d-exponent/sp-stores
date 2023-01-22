import ItemCard from './cards/item'
import classes from './css-modules/products.module.css'

export default function AllProductsPage(props) {
	return (
		<section>
		
			<h1>Happy Shopping</h1>

			{props.products?.map((product) => (
				<ItemCard key={product._id} product={product} favorite={true} purchase={true} />
			))}

			{!props.products ? <p>There are no products at this time</p> : null}
		</section>
	)
}
