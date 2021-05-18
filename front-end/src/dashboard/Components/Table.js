import axios from "axios"
import { useState, useEffect } from "react"
import ErrorAlert from "../../layout/ErrorAlert"

export default function Table({ table }) {
  const [isOccupied, setIsOccupied] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    setIsOccupied(table.reservation_id && true)
  }, [table])

  const handleClick = async () => {
    const req = { data: { status: "finished" } }
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/reservations/${table.reservation_id}/status`,
          req
        )
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/tables/${table.table_id}/seat`
        )
      } catch (err) {
        if (err.response) {
          setDeleteError(err.response.data)
        }
      }
    }
  }

  return (
    <div className="card m-3">
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
    </div>
  )
}
