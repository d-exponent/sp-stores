import { Fragment } from 'react'

import Hero from './layout/hero'
import CollectionsGrid from './collections/collections-grid'
import CollectionGroup from './collections/collection-group'
import classes from './css-modules/home.module.css'

const Home = (props) => {
	return (
		<div className={classes.container}>
			<Hero />
			<div className={classes.content}>
				<Fragment>
					<CollectionsGrid collections={props.collections} />
					<CollectionGroup groups={props.groups} />
				</Fragment>
			</div>
		</div>
	)
}

export default Home


