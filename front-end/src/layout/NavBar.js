import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChessBishop, faSearch } from "@fortawesome/free-solid-svg-icons"

export default function NavBar() {
  return (
    <nav className="container-fluid d-grid gap-3 align-items-center">
      <div className="row">
        <div className="col col-md-4">
          <FontAwesomeIcon icon={faChessBishop} size="2x" />
        </div>
        <div className="col col-7">
          <div className="d-flex align-items-center">
            <form className="w-100 me-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
              />
            </form>
          </div>
        </div>
        <FontAwesomeIcon icon={faSearch} className="my-2 ml-2" size="lg" />
      </div>
    </nav>
  )
}
