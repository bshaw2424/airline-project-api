import AirlineData from "./AirlineData";
import { Link } from "react-router-dom";

export default function AirlineDataModal({ airlines, id }) {
  const getAirlineCode = name => {
    const nameCode = name.name;
    switch (nameCode) {
      case "Alaska Airlines":
        return "AS";
      case "Allegiant Air":
        return "G4";
      case "American Airlines":
        return "AA";
      case "Delta Airlines":
        return "DL";
      case "Frontier Airlines":
        return "F9";
      case "Hawaiian Airlines":
        return "HA";
      case "JetBlue Airways":
        return "B6";
      case "Southwest Airlines":
        return "WN";
      case "Spirit Airlines":
        return "NK";
      case "United Airlines":
        return "UA";
      default:
        return;
    }
  };

  return (
    <>
      <article
        className="modal fade"
        style={{
          marginTop: "10rem",
        }}
        id={id}
        tabIndex="-1"
        aria-labelledby="airlineModalDataLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-7 " id={id}>
                {airlines.name} - ( {getAirlineCode(airlines)} )
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <AirlineData airlineName={airlines} />
            </div>
            <div className="modal-footer">
              <Link
                className="btn btn-primary"
                to={`/airlines/${airlines.slug}/destinations`}
                alt={`${airlines.name} Link`}
              >
                View Destinations
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
