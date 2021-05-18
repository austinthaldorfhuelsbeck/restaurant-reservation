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
    <main>
      <h1>Dashboard</h1>
      <hr />
      <div className="container">
        <h3>Date: {date}</h3>
        <h4>Reservations:</h4>
        <div className="col col-md-6 py-3">
          <ErrorAlert error={reservationsError} />
          {reservationsList}
        </div>
        <h4>Tables:</h4>
        <div className="col col-md-6 py-3">
          <ErrorAlert error={tablesError} />
          {tablesList}
        </div>
        <DashboardNav date={date} />
      </div>
    </main>
  )
}
