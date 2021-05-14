export default function Table({ table }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{table.table_name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Capacity: {table.capacity}
        </h6>
        <p className="card-text" data-table-id-status={table.table_id}>
          Free : Occupied
        </p>
      </div>
    </div>
  )
}
