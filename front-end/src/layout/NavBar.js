import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUtensils, faSearch } from "@fortawesome/free-solid-svg-icons"

export default function NavBar() {
  return (
    <nav className="container-fluid d-grid gap-3 align-items-center">
      <div className="row justify-content-between">
        <div className="col col-2 col-md-1 bg-info py-3">
          <FontAwesomeIcon
            icon={faUtensils}
            size="2x"
            className="text-light ml-2"
          />
        </div>
        <div className="col col-8 py-3">
          <div className="d-flex align-items-right">
            <form className="w-100 me-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
              />
            </form>
            <FontAwesomeIcon icon={faSearch} className="my-2 ml-2" size="lg" />
          </div>
        </div>
      </div>
    </nav>
  )
}
