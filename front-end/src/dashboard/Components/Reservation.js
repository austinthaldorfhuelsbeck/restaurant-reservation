import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faCheck } from "@fortawesome/free-solid-svg-icons"
import { convertFromMilitary } from "../../utils/date-time"

export default function Reservation({ reservation }) {
  // console.log("Reservation:", reservation)

  const seatButton = reservation.status === "booked" && (
    <a href={`/reservations/${reservation.reservation_id}/seat`}>
      <button className="btn btn-outline-secondary">Seat</button>
    </a>
  )

  return (
    <div className="container card-body">
      <h5 className="text-center">
        {reservation.first_name} {reservation.last_name}
      </h5>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Status</th>
            <th scope="col">Time</th>
            <th scope="col">Party of</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{reservation.reservation_id}</th>
            <td>
              <p data-reservation-id-status={reservation.reservation_id}>
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
            </td>
            <td>
              <h5 className="my-auto">
                {convertFromMilitary(reservation.reservation_time)}
              </h5>
            </td>
            <td>
              <h5 className="my-auto">{reservation.people}</h5>
            </td>
          </tr>
        </tbody>
      </table>
      {seatButton}
    </div>
  )
}
