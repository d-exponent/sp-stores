import Item from '../cards/item'
import classes from './product-grid.module.css'

const Products = (props) => {
	return (
		<div>
			{props.products.map((product) => (
				<Item key={product._id} 
				product={product} />
			))}
		</div>
	)
}

export default Products
