import { useContext } from 'react'
import ReactDOM from 'react-dom'

import SideNavContext from '../../context/side-nav'
import classes from './side-nav.module.css'

export default function MobileNavPane() {
  const { hideSideNav } = useContext(SideNavContext)

  return ReactDOM.createPortal(
    <div className={classes.container}>
      <div className={classes.navPane}></div>
      <button className={classes.closeNavBtn} onClick={hideSideNav}>
        X
      </button>
    </div>,
    document.getElementById('side-nav')
  )
}
