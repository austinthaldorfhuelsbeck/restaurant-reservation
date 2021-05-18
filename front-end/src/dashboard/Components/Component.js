import React, { useState } from "react"

import Reservation from "./Reservation"
import Table from "./Table"

export default function Component({ title, items }) {
  const [toggle, setToggle] = useState(true)

  const renderList =
    toggle &&
    items &&
    items.map((item, index) => (
      <li className="list-group-item" key={index}>
        {title === "reservations" && item.status !== "finished" && (
          <Reservation reservation={item} />
        )}
        {title === "tables" && <Table table={item} />}
      </li>
    ))

  const handleHide = () => setToggle(!toggle)

  return (
    <ul className="list-group py-3">
      <li className="list-group-item">
        <h5>{title}</h5>
        <p onClick={handleHide}>{toggle ? "[-]" : "[+]"}</p>
      </li>
      {renderList}
    </ul>
  )
}
