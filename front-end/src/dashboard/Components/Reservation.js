import axios from "axios"
import { useState } from "react"
import ErrorAlert from "../../layout/ErrorAlert"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faCheck } from "@fortawesome/free-solid-svg-icons"

export default function Reservation({ reservation }) {
  const [reservationsError, setReservationsError] = useState(null)

  const handleClick = async () => {
    const req = { data: { status: "seated" } }
    try {
      await axios.put(
        `${process.enb.API_BASE_URL}/reservations/${reservation.reservation_id}/status`,
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
        <button className="btn btn-outline-secondary" onClick={handleClick}>
          Seat
        </button>
      </a>
    )

  return (
    reservation.status !== "finished" && (
      <div className="card">
        <div className="container card-body">
          <div className="row">
            <h5 className="col-11 card-title">
              {reservation.first_name} {reservation.last_name}
            </h5>
            <p
              className="card-text"
              data-reservation-id-status={reservation.reservation_id}
            >
              {reservation.status === "booked" && (
                <span title="Booked">
                  <FontAwesomeIcon icon={faClock} />
                </span>
              )}
              {reservation.status === "seated" && (
                <span title="Seated">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
              )}
            </p>
          </div>
          <h6 className="card-subtitle mb-2 text-muted">
            {reservation.reservation_time}
          </h6>
          <p className="card-text">Party Size: {reservation.people}</p>
          <p className="card-text">
            Reservation #: {reservation.reservation_id}
          </p>
          {<SeatButton />}
        </div>
        <ErrorAlert error={reservationsError} />
      </div>
    )
  )
}
