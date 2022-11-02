import { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

import SideNavContext from '../../context/side-nav'
import classes from './hamburger-menu.module.css'

const Hamburger = () => {
	const { showSideNav, isShowSideNav, hideSideNav } = useContext(SideNavContext)

	function showSideNavToggler() {
		if (isShowSideNav) {
			return hideSideNav()
		}
		showSideNav()
	}

	return (
		<div className={classes.container} onClick={showSideNavToggler}>
			{!isShowSideNav ? (
				<div className={classes.burger}>
					<GiHamburgerMenu />
				</div>
			) : (
				<span className={classes.cross}>&#10006;</span>
			)}
		</div>
	)
}

export default Hamburger
{
	/* <span className={classes.cross}>&#215;</span> */
}