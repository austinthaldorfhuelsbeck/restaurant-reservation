import { useHistory } from "react-router-dom"
import { formatAsDate } from "../utils/date-time"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons"

export default function DashboardNav({ date }) {
  const history = useHistory()

  /**
   * Increments or decrements the date and updates history
   * @param isNext
   *  Boolean representing whether to increment or decrement
   */
  function handleChange(isNext) {
    const d = new Date(date)
    if (isNext) {
      d.setDate(d.getDate() + 1)
    } else {
      d.setDate(d.getDate() - 1)
    }
    const result = formatAsDate(d.toISOString())
    history.push(`/dashboard/?date=${result}`)
  }
  const handleToday = () => {
    history.push("/dashboard")
  }

  return (
    <div>
      <button
        onClick={() => handleChange(false)}
        className="btn btn-outline-secondary m-2"
      >
        <FontAwesomeIcon icon={faBackward} />
      </button>
      <button onClick={handleToday} className="btn btn-outline-secondary m-2">
        TODAY
      </button>
      <button
        onClick={() => handleChange(true)}
        className="btn btn-outline-secondary m-2"
      >
        <FontAwesomeIcon icon={faForward} />
      </button>
    </div>
  )
}
