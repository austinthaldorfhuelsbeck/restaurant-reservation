import axios from "axios"
import { useState } from "react"
import ErrorAlert from "../../layout/ErrorAlert"
// TODO: environment variables
const BASE_API_URL = "http://localhost:5000" // "https://restaurant-reservation-api.vercel.app"

export default function Table({ table }) {
  const [deleteError, setDeleteError] = useState(null)

  const isOccupied = table.reservation_id
    ? `Occupied - reservation #${table.reservation_id}`
    : "Free"

  const handleClick = async () => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${BASE_API_URL}/${table.table_id}/seat`)
      } catch (err) {
        if (err.response) {
          setDeleteError(err.response.data)
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
          {isOccupied}
        </p>
        {table.reservation_id && (
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
    </div>
  )
}
