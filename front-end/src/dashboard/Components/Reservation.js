import axios from "axios"
import { useState } from "react"
import ErrorAlert from "../../layout/ErrorAlert"
// TODO: environment variables
const BASE_API_URL = "http://localhost:5000" // "https://restaurant-reservation-api.vercel.app"

export default function Reservation({ reservation }) {
  const [reservationsError, setReservationsError] = useState(null)

  const handleClick = async () => {
    const req = { data: { status: "seated" } }
    try {
      await axios.put(
        `${BASE_API_URL}/reservations/${reservation.reservation_id}/status`,
        req
      )
    } catch (err) {
      if (err.response) {
        setReservationsError(err.response.data)
      }
    }
  }

  const SeatButton = () =>
    reservation.status === "booked" && (
      <a href={`/reservations/${reservation.reservation_id}/seat`}>
        <button className="btn btn-outline-primary" onClick={handleClick}>
          Seat
        </button>
      </a>
    )

  return (
    reservation.status !== "finished" && (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {reservation.first_name} {reservation.last_name}
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {reservation.reservation_time}
          </h6>
          <p className="card-text">Party Size: {reservation.people}</p>
          <p className="card-text">
            Reservation #: {reservation.reservation_id}
          </p>
          <p
            className="card-text"
            data-reservation-id-status={reservation.reservation_id}
          >
            Reservation Status: {reservation.status}
          </p>
          {<SeatButton />}
        </div>
        <ErrorAlert error={reservationsError} />
      </div>
    )
  )
}
