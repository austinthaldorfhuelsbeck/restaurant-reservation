import axios from "axios"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"

export default function NewTable() {
  const initialFormState = {
    table_name: "",
    capacity: 0,
  }
  const history = useHistory()
  const [formData, setFormData] = useState({ ...initialFormState })
  const [reservationsError, setReservationsError] = useState(null)

  // HANDLERS
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.id]: target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/tables/new`,
        formData
      )
      history.push("/dashboard")
    } catch (err) {
      if (err.response) {
        setReservationsError(err.response.data)
      }
    }
  }
  const handleCancel = () => {
    history.goBack()
  }

  return (
    <div className="form-component m-5">
      <h1>New Table</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            type="text"
            className="form-control"
            id="table_name"
            placeholder="Name of the table"
            onChange={handleChange}
            value={formData.table_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            className="form-control"
            id="capacity"
            onChange={handleChange}
            value={formData.capacity}
          />
        </div>
        <button type="submit" className="btn btn-outline-secondary m-2">
          Submit
        </button>
        <button
          onClick={handleCancel}
          className="btn btn-outline-secondary m-2"
        >
          Cancel
        </button>
      </form>
      <ErrorAlert error={reservationsError} />
    </div>
  )
}
