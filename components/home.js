import { Fragment } from 'react'

import Hero from './layout/hero'
import CollectionsGrid from './collections/collections-grid'
import CollectionGroup from './collections/collection-group'
import classes from './css-modules/home.module.css'

const Home = (props) => {
	const { collections, groups } = props
	return (
		<div className={classes.container}>
			<Hero />
			<div className={classes.content}>
				<Fragment>
					<CollectionsGrid collections={collections} />
					{groups ? <CollectionGroup groups={groups} /> : null}
				</Fragment>
			</div>
		</div>
	)
}

export default Home
