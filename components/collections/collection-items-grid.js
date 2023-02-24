import ItemCard from '../cards/item'
import classes from './collections-items-grid.module.css'

export default function CollectionItemsGrid(props) {
  return (
    <div className={`${classes.container} grid`}>
      {props.items.map(item => (
        <ItemCard
          key={item._id}
          product={item}
          showToCollections={props.showToCollections}
          useBoxShadow={props.itemUseShadow}
          toBag={props.itemShowToBag}
        />
      ))}
    </div>
  )
}
