import { IoMdClose } from "react-icons/io";
export default function AirlineDrawer({ airline, onClose }) {
  if (!airline) {
    return null;
  }

  return (
    <aside className="airline-drawer px-3 my-4 w-100">
      <ul className="airline-drawer__list py-3 border border-1">
        <div className="airline-drawer__header">
          <div>
            <div className="d-flex align-items-center justify-content-end w-100 p-3">
              <button
                type="button"
                className="airline-drawer__close bg-white border-0"
                onClick={onClose}
                aria-label="Close airline destinations"
              >
                <IoMdClose size="1.2rem" />
              </button>
            </div>
          </div>
        </div>
        <h2 className="text-center my-4">
          {airline.name} - {airline.matchingAirportCount}{" "}
          {airline.matchingAirportCount === 1
            ? "matching airport"
            : "matching airports"}
        </h2>
        {airline.matchingAirports.map(airport => (
          <li
            key={`${airline.id}-${airport.airport_code}`}
            className="airline-drawer__item"
          >
            <div className="airline-drawer__airport-title">
              <strong className="me-2">{airport.city || airport.name}</strong> -
              {airport.airport_code && (
                <span className="ms-2">{airport.airport_code}</span>
              )}
            </div>

            <p>{airport.airport_name}</p>

            {/* <small>
              {[airport.state, airport.country]
                .filter(Boolean)
                .join(", ")}
            </small> */}
          </li>
        ))}
      </ul>
    </aside>
  );
}
