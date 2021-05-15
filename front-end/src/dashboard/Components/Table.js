export default function Table({ table }) {
  const isOccupied = table.reservation_id
    ? `Occupied - reservation #${table.reservation_id}`
    : "Free"

  const handleClick = () => {
    // TODO
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
    </div>
  )
}
