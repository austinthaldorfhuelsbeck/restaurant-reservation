import React, { useState } from "react"

import Reservation from "./Reservation"
import Table from "./Table"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"

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
      <li className="list-group-item d-flex align-items-start align-items-sm-end justify-content-between">
        <h5 className="my-auto">{title}</h5>
        <p className="text-secondary my-auto" onClick={handleHide}>
          {toggle ? (
            <FontAwesomeIcon icon={faMinus} />
          ) : (
            <FontAwesomeIcon icon={faPlus} />
          )}
        </p>
      </li>
      {renderList}
    </ul>
  )
}
