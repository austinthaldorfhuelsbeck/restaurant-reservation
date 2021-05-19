import React, { useState } from "react"

import Reservation from "./Reservation"
import Table from "./Table"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"

export default function ListComponent({ title, items }) {
  const [toggle, setToggle] = useState(true)

  const renderList = () => {
    if (toggle && items) {
      return items.map((item, index) => {
        if (title === "reservations" && item.status !== "finished") {
          return (
            <li className="list-group-item" key={index}>
              <Reservation reservation={item} />
            </li>
          )
        }
        if (title === "tables") {
          return (
            <li className="list-group-item" key={index}>
              <Table table={item} />
            </li>
          )
        }
        return <div></div>
      })
    }
  }

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
      {renderList()}
    </ul>
  )
}
