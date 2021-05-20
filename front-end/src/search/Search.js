import axios from "axios"
import React, { useState } from "react"
import ErrorAlert from "../layout/ErrorAlert"
import ListTables from "../dashboard/Components/ListTables"

export default function Search() {
  const [formData, setFormData] = useState({ mobile_number: "" })
  const [results, setResults] = useState([])
  const [searchError, setSearchError] = useState(null)

  // HANDLERS
  const handleChange = ({ target }) => {
    setFormData({
      [target.name]: target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reservations?mobile_phone=${formData.mobile_number}`,
        formData
      )
      setResults(response)
    } catch (err) {
      if (err.response) {
        setSearchError(err.response.data)
      }
    }
  }

  return (
    <div className="component">
      <h1>Search by Phone Number</h1>
      <hr />
      <div className="form-component m-5">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group col-12 col-md-8 col-lg-6">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                name="mobile_phone"
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
                value={formData.mobile_number}
              />
            </div>
            <div className="col-12 col-md-4 mt-md-2">
              <button type="submit" className="btn btn-outline-secondary mt-4">
                Find
              </button>
            </div>
          </div>
        </form>
        <ErrorAlert error={searchError} />
      </div>
      <ListTables tables={results} />
    </div>
  )
}
