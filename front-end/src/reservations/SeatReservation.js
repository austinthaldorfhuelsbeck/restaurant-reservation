import axios from "axios"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import { listTables } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
// TODO: environment variables
const BASE_API_URL = "http://localhost:5000" // "https://restaurant-reservation-api.vercel.app"

export default function SeatReservation() {
  const initialFormState = { table_id: 0 }
  const history = useHistory()
  const { reservation_id } = useParams()

  const [formData, setFormData] = useState({ ...initialFormState })
  const [seatError, setSeatError] = useState(null)
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  useEffect(loadTables, [])

  function loadTables() {
    const abortController = new AbortController()
    setTablesError(null)
    listTables(abortController.signal).then(setTables).catch(setTablesError)
    return () => abortController.abort()
  }

  // HANDLERS
  const handleChange = ({ target }) => {
    setFormData({
      table_id: target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const req = { data: { reservation_id } }
    try {
      await axios.post(`${BASE_API_URL}/tables/${formData.table_id}/seat`, req)
      history.push("/dashboard")
    } catch (err) {
      if (err.response) {
        setSeatError(err.response.data)
      }
    }
  }
  const handleCancel = () => {
    history.goBack()
  }

  // Build tables list
  const tablesList = tables.map((table, index) => (
    <option key={index} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ))

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id">Table Number:</label>
          <select
            name="table_id"
            className="form-select"
            aria-label="Select Table Number"
            onChange={handleChange}
            value={formData.table_id}
          >
            <option selected>Select a Table</option>
            {tablesList}
          </select>
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <button onClick={handleCancel} className="btn btn-outline-primary">
          Cancel
        </button>
      </form>
      <ErrorAlert error={seatError} />
      <ErrorAlert error={tablesError} />
    </div>
  )
}
