import CollectionItemsGrid from './collections/collection-items-grid'

import classes from './css-modules/all-products.module.css'

export default function AllProducts(props) {
  return (
    <section className={classes.container}>
      {props.products ? (
        <CollectionItemsGrid items={props.products} />
      ) : (
        <div className={`${classes.empty} grid-center`}>
          <h1>There are no products at this time</h1>
        </div>
      )}
    </section>
  )
}
