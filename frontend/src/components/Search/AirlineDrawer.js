import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

export default function AirlineDrawer({ airline, onClose }) {
  if (!airline) {
    return null;
  }

  return (
    <aside className="airline-drawer container my-4">
      <div className="border rounded-3 shadow-sm bg-white overflow-hidden">
        <header className="d-flex align-items-start justify-content-between gap-3 p-3 p-md-4 border-bottom">
          <div>
            <h2 className="fs-4 fw-semibold mb-2">{airline.name}</h2>

            <p className="text-muted mb-0">
              {airline.matchingAirportCount}{" "}
              {airline.matchingAirportCount === 1
                ? "matching airport"
                : "matching airports"}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            onClick={onClose}
            aria-label="Close airline destinations"
            style={{ width: "38px", height: "38px" }}
          >
            <IoMdClose size="1.2rem" />
          </button>
        </header>

        <div className="p-3 p-md-4">
          <ul className="row g-3 list-unstyled mb-0">
            {(airline.matchingAirports ?? []).map(airport => (
              <li
                key={`${airline.id}-${airport.airport_code}`}
                className="col-12 col-md-6 col-lg-4"
              >
                <div className="airline-drawer__item border rounded-3 p-3 h-100">
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <strong>{airport.city || airport.name}</strong>

                    {airport.airport_code && (
                      <span className="badge bg-light text-dark border">
                        {airport.airport_code}
                      </span>
                    )}
                  </div>

                  <p className="text-muted small mb-0">
                    {airport.airport_name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {airline.slug && (
          <footer className="border-top p-3 p-md-4 d-flex justify-content-center justify-content-md-end">
            <Link to={`/airlines/${airline.slug}`} className="btn btn-primary">
              View {airline.name} Page →
            </Link>
          </footer>
        )}
      </div>
    </aside>
  );
}
