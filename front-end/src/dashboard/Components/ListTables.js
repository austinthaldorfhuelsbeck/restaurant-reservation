import React, { useState } from "react"

import Table from "./Table"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"

export default function ListTables({ tables, setRefresh }) {
  const [toggle, setToggle] = useState(true)

  const renderList = () => {
    if (!toggle || !tables) return null
    return tables.map((table) => (
      <li className="list-group-item" key={table.table_id}>
        <Table table={table} setRefresh={setRefresh} />
      </li>
    ))
  }

  const handleHide = () => setToggle(!toggle)

  return (
    <ul className="list-group py-3">
      <li className="list-group-item d-flex align-items-start align-items-sm-end justify-content-between">
        <h5 className="my-auto">Tables</h5>
        <p className="text-secondary my-auto" onClick={handleHide}>
          {toggle ? (
            <FontAwesomeIcon icon={faMinus} />
          ) : (
            <FontAwesomeIcon icon={faPlus} />
          )}
        </p>
      </li>
      {renderList()}
    </ul>
  )
}
