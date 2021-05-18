import React from "react"

import { Link } from "react-router-dom"

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav>
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <svg className="bi me-2" width="40" height="32">
            FA
          </svg>
          <span className="fs-4">Periodic Tables</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Link to="/dashboard" className="nav-link text-white">
              <svg className="bi me-2" width="16" height="16">
                FA
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/search" className="nav-link text-white">
              <svg className="bi me-2" width="16" height="16">
                FA
              </svg>
              Search
            </Link>
          </li>
          <li>
            <Link to="/reservations/new" className="nav-link text-white">
              <svg className="bi me-2" width="16" height="16">
                FA
              </svg>
              New Reservation
            </Link>
          </li>
          <li>
            <Link to="/tables/new" className="nav-link text-white">
              <svg className="bi me-2" width="16" height="16">
                FA
              </svg>
              New Table
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Menu
