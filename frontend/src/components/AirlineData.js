import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";

function AirlineData({ airlineName }) {
  const destinationCountTotal = (destinationType, stringBoolean) =>
    airlineName.destinations.filter(
      destination => destination[destinationType] === stringBoolean,
    ).length;

  return (
    <section className="my-4 px-0">
      <div className="container">
        <p className="border border-dark p-1 text-center">
          <strong>Total Destinations: </strong>
          {airlineName.destinations.length}
        </p>
        <ul className="m-0">
          <li>
            <strong>Domestic:</strong>{" "}
            {destinationCountTotal("international", "false")}
          </li>
          <li>
            <strong>International:</strong>{" "}
            {destinationCountTotal("international", "true")}
          </li>
          <li>
            <strong>Seasonal:</strong>{" "}
            {destinationCountTotal("seasonal", "true")}
          </li>
        </ul>

        <p className="pt-2" style={{ borderTop: "1px solid #333" }}>
          <Link
            to={airlineName.website}
            alt={airlineName.name}
            target="_blank"
            rel="noreferrer"
          >
            <span className="me-2">
              <FiExternalLink fontSize={"1.3rem"} />
            </span>
            {airlineName.website}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default AirlineData;
