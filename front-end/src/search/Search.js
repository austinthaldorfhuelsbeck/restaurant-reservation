import axios from "axios"
import React, { useState } from "react"
import ErrorAlert from "../layout/ErrorAlert"

export default function Search() {
  const [formData, setFormData] = useState({ mobile_number: "" })
  const [searchError, setSearchError] = useState(null)

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
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reservations?mobile_phone=${formData.mobile_number}`,
        formData
      )
    } catch (err) {
      if (err.response) {
        setSearchError(err.response.data)
      }
    }
  }

  return <div></div>
}
