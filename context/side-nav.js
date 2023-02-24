import { createContext, useState } from 'react'

const SideNavContext = createContext({
  isShowSideNav: Boolean,
  showSideNav: function () {},
  hideSideNav: function () {},
})

export const SideNavContextProvider = props => {
  const [isShowSideNav, setIsShowSIdeNav] = useState(false)

  const showPane = function () {
    setIsShowSIdeNav(true)
  }

  const hidePane = function () {
    setIsShowSIdeNav(false)
  }

  const contextValue = {
    isShowSideNav,
    showSideNav: showPane,
    hideSideNav: hidePane,
  }

  return (
    <SideNavContext.Provider value={contextValue}>
      {props.children}
    </SideNavContext.Provider>
  )
}

export default SideNavContext
