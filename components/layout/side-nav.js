import {  useContext } from 'react'

import SideNavContext from '../../context/side-nav'
import classes from './side-nav.module.css'

const MobileNavPane = () => {
	// slideOutAnimation
	const { hideSideNav } = useContext(SideNavContext)


	return (
		<div className={classes.container}>
			<div className={classes.navPane}></div>
			<button className={classes.closeNavBtn} onClick={hideSideNav}>
				X
			</button>
		</div>
	)
}

export default MobileNavPane
