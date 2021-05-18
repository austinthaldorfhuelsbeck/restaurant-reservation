import React, { Fragment } from "react"
import NavBar from "./NavBar"
import SideBar from "./SideBar"
import Routes from "./Routes"

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <Fragment>
      <header className="py-3 mb-3 border-bottom">
        <NavBar />
      </header>
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-md-2 side-bar">
            <SideBar />
          </div>
          <div className="col">
            <Routes />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Layout
