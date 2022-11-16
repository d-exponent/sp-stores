import CollectionItemsGrid from './collections/collection-items-grid'

import classes from './css-modules/all-products.module.css'

const AllProducts = ({ products }) => {
	return (
		<section className={classes.container}>
			{products ? (
				<CollectionItemsGrid items={products} />
			) : (
				<div className={`${classes.empty} grid-center`}>
					<h1>There are no products at this time</h1>
				</div>
			)}
		</section>
	)
}

export default AllProducts
