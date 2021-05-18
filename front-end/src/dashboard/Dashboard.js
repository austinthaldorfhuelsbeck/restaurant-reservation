import React, { useEffect, useState } from "react"
import { listReservations, listTables } from "../utils/api"

import ErrorAlert from "../layout/ErrorAlert"
import DashboardNav from "./DashboardNav"
import Component from "./Components/Component"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"

/**
 *  Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({ date }) {
  const [reservations, setReservations] = useState([])
  const [reservationsError, setReservationsError] = useState(null)
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  useEffect(loadDashboard, [date])

  function loadDashboard() {
    const abortController = new AbortController()
    setReservationsError(null)

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
    listTables(abortController.signal).then(setTables).catch(setTablesError)

    return () => abortController.abort()
  }

  return (
    <main className="container">
      <div className="row">
        <div className="col col-6">
          <h1>Dashboard</h1>
          <p>
            <FontAwesomeIcon icon={faCalendarAlt} /> {date}
          </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col col-12 col-md-6">
          <DashboardNav date={date} />
          <Component title="reservations" items={reservations} />
        </div>
        <div className="col col-12 col-md-6">
          <Component title="tables" items={tables} />
        </div>
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
      </div>
    </main>
  )
}
