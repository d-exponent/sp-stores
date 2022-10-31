import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Hero from './layout/hero'
import CollectionGrid from './collections/collections-grid'
import ProductGrid from './products/product-grid'
import classes from './css-modules/home.module.css'

const HomePage = (props) => {
	const router = useRouter()

	useEffect(() => {
		if (router.query.reference && router.query.trxref) {
			router.replace('/')
		}
	}, [router])

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
