import React, { useEffect, useState } from "react"
import { listReservations, listTables } from "../utils/api"

import Reservation from "./Components/Reservation"
import Table from "./Components/Table"
import ErrorAlert from "../layout/ErrorAlert"
import DashboardNav from "./DashboardNav"

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

  const reservationsList = reservations.map(
    (reservation, index) =>
      reservation.status !== "finished" && (
        <div key={index}>
          <Reservation reservation={reservation} />
        </div>
      )
  )

  const tablesList = tables.map((table, index) => (
    <div key={index}>
      <Table table={table} />
    </div>
  ))

  return (
    <main className="container">
      <div className="row">
        <div className="col col-6">
          <h1>Dashboard</h1>
          {date}
        </div>
        <div className="col col-6 my-auto">
          <DashboardNav date={date} />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col col-12 col-md-6 py-3">
          <h5>Reservations</h5>
          <ErrorAlert error={reservationsError} />
          {reservationsList}
        </div>
        <div className="col col-12 col-md-6 py-3">
          <h5>Tables</h5>
          <ErrorAlert error={tablesError} />
          {tablesList}
        </div>
      </div>
    </main>
  )
}
