import axios from "axios"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
// TODO: environment variables
const BASE_API_URL = "http://localhost:5000" // "https://restaurant-reservation-api.vercel.app"

export default function NewTable() {
  const initialFormState = {
    table_name: "",
    capacity: "",
  }
  const history = useHistory()
  const [formData, setFormData] = useState({ ...initialFormState })
  const [reservationsError, setReservationsError] = useState(null)

  // HANDLERS
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.id]: target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${BASE_API_URL}/tables`, formData)
      history.push("/dashboard")
    } catch (err) {
      setReservationsError(err.response.data)
    }
  }
  const handleCancel = () => {
    history.goBack()
  }

  return (
    <div>
      Under Construction.
      <ErrorAlert error={reservationsError} />
    </div>
  )
}
