import { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

import SideNavContext from '../../context/side-nav'
import classes from './hamburger-menu.module.css'


const Hamburger = () => {
	const { showSideNav } = useContext(SideNavContext)

	return (
		<div className={classes.burger} onClick={showSideNav}>
			<GiHamburgerMenu />
		</div>
	)
}

export default Hamburger
