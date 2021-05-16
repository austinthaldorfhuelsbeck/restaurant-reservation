import axios from "axios"
import { useState, useEffect } from "react"
import ErrorAlert from "../../layout/ErrorAlert"
// TODO: environment variables
const BASE_API_URL = "http://localhost:5000" // "https://restaurant-reservation-api.vercel.app"

export default function Table({ table }) {
  const [isOccupied, setIsOccupied] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [reservationsError, setReservationsError] = useState(null)

  useEffect(() => {
    setIsOccupied(table.reservation_id && true)
  }, [table])

  const handleClick = async () => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${BASE_API_URL}/tables/${table.table_id}/seat`)
        setIsOccupied(false)
      } catch (err) {
        if (err.response) {
          setDeleteError(err.response.data)
        }
      }
      try {
        await axios.put(
          `${BASE_API_URL}/reservations/${table.reservation_id}/status`,
          "finished"
        )
      } catch (err) {
        if (err.response) {
          setReservationsError(err.response.data)
        }
      }
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{table.table_name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Capacity: {table.capacity}
        </h6>
        <p className="card-text" data-table-id-status={table.table_id}>
          {isOccupied
            ? `Occupied - reservation #${table.reservation_id}`
            : "Free"}
        </p>
        {isOccupied && (
          <button
            onClick={handleClick}
            data-table-id-finish={table.table_id}
            className="btn btn-outline-primary"
          >
            Finish
          </button>
        )}
      </div>
      <ErrorAlert error={deleteError} />
      <ErrorAlert error={reservationsError} />
    </div>
  )
}
