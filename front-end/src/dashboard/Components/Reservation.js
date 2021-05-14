export default function Reservation({ reservation }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {reservation.reservation_time}
        </h6>
        <p className="card-text">Party Size: {reservation.people}</p>
        <a
          href={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-outline-primary"
        >
          Seat
        </a>
      </div>
    </div>
  )
}
