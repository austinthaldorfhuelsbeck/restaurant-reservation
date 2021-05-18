import axios from "axios"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"

export default function NewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
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
        `${process.env.REACT_APP_API_BASE_URL}/reservations`,
        formData
      )
      history.push(`/dashboard?date=${formData.reservation_date}`)
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
      <h1>New Reservation</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            placeholder="Customer's first name here"
            onChange={handleChange}
            value={formData.first_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            placeholder="Customer's last name here"
            onChange={handleChange}
            value={formData.last_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            id="mobile_number"
            placeholder="E.g. 541 444 0755"
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            className="form-control"
            id="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            className="form-control"
            id="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Party Size</label>
          <input
            type="text"
            className="form-control"
            id="people"
            onChange={handleChange}
            value={formData.people}
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
