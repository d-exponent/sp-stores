import { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

import SideNavContext from '../../context/side-nav'
import classes from './hamburger-menu.module.css'

const Hamburger = () => {
	const { showSideNav, isShowSideNav, hideSideNav } = useContext(SideNavContext)

	function handleSideNavToggle() {
		if (isShowSideNav) {
			return hideSideNav()
		}
		showSideNav()
	}

	return (
		<div className={classes.container} onClick={handleSideNavToggle}>
			<div className={`${classes.burger} grid`}>
				<GiHamburgerMenu />
			</div>
		</div>
	)
}

export default Hamburger
