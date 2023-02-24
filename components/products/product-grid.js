import Item from '../cards/item'
import classes from './product-grid.module.css'

export default function Products(props) {
  return (
    <div>
      {props.products.map(product => (
        <Item key={product._id} product={product} />
      ))}
    </div>
  )
}
