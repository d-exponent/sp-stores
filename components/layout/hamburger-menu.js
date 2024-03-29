import { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

import SideNavContext from '../../context/side-nav'
import classes from './hamburger-menu.module.css'

export default function Hamburger() {
  const { showSideNav, isShowSideNav, hideSideNav } =
    useContext(SideNavContext)

  const handleToggleSideNav = function () {
    if (isShowSideNav) return hideSideNav()

    showSideNav()
  }

  return (
    <div className={classes.container} onClick={handleToggleSideNav}>
      <div className={`${classes.burger} grid`}>
        <GiHamburgerMenu />
      </div>
    </div>
  )
}
