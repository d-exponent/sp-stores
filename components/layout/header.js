import { useContext } from 'react'

import SideNavContext from '../../context/side-nav'
import Logo from './logo'
import Nav from './nav'
import SideNavigationPanel from './side-nav'
import Hamburger from './hamburger-menu'
import classes from './header.module.css'

export default function Header() {
  const { isShowSideNav } = useContext(SideNavContext)
  return (
    <header className={`${classes.header} flex`}>
      <>
        <Hamburger />
        <Logo />
        <Nav />
        {isShowSideNav && <SideNavigationPanel />}
      </>
    </header>
  )
}
