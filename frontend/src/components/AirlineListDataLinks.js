import { useState } from "react";
// import AirlineDataModal from "./AirlineDataModal";
import { Link } from "react-router-dom";
import ThumbsUpIcon from "./ThumbsUpIcon";

const styles = {
  width: "96%",
  padding: "1rem",
  position: "relative",
  cursor: "pointer",
  background: "#fff",
};

const airlineCodes = {
  "Alaska Airlines": "AS",
  "Allegiant Air": "G4",
  "American Airlines": "AA",
  "Delta Airlines": "DL",
  "Frontier Airlines": "F9",
  "Hawaiian Airlines": "AS",
  "JetBlue Airways": "B6",
  "Southwest Airlines": "WN",
  "Spirit Airlines": "NK",
  "United Airlines": "UA",
};

const getAirlineCode = airlineName => {
  return airlineCodes[airlineName] || "";
};

export default function AirlineListDataLinks({ airlineNameData, icons }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // const handleMouseEnter = index => setHoveredIndex(index);

  // const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <section>
      <div className="airline-divs mb-0">
        {airlineNameData.map((airline, index) => (
          <div
            style={styles}
            key={`${airline.name}-${index}`}
            className={`Links mb-4 rounded airlineNameLink 
              ${hoveredIndex === index ? "shadow" : "airline-border "}
              Link-${index + 1} py-2`}
            data-bs-toggle="modal"
            data-bs-target={`#airlineModalData-${airline._id}`}
          >
            <h2
              style={{
                borderBottom: "1px solid #636363",
              }}
              className="pt-2"
            >
              {airline.name} - <span>( {getAirlineCode(airline.name)} )</span>
            </h2>
            <p className="p-0">
              <Link
                to={airline.website}
                alt={`${airline.name} website`}
                target="_blank"
              >
                {airline.website}
              </Link>
            </p>
            <p>
              <strong>Total Destinations:</strong> {airline.destinations.length}
              <span>{airline.estinations}</span>
            </p>

            {/* displays thumbs up icons with valid airport code look up */}
            {icons[index] && <ThumbsUpIcon />}
            {/* <AirlineDataModal
              airlines={airline}
              id={`airlineModalData-${airline._id}`}
            /> */}
            <Link
              className="btn btn-outline-dark w-100 mb-3"
              to={`/airlines/${airline.slug}/destinations`}
            >
              View Destinations
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
