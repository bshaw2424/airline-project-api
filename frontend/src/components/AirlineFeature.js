import { Link } from "react-router-dom";
const AirlineFeature = ({ link }) => {
  // const marginClass = isLast ? "me-0" : "me-5";
  return (
    <div
      className={`flex-column airline-feature`}
      style={{
        fontSize: "1.2em",
      }}
    >
      <h2
        className="border-bottom border-dark pb-3"
        style={{ fontSize: "3.3rem" }}
      >
        Airport Security Tips
      </h2>
      <p style={{ fontSize: "2rem" }}>
        Discover what items are <span className="text-danger">Prohibited</span>{" "}
        and what items are <span className="text-success">Acceptable</span> for
        carry-on and checked luggage before arriving at the airport.
      </p>
      <span>
        <Link
          to={link}
          target="_blank"
          rel="noreferrer"
          alt="TSA - What Can I Bring Resource List"
          className="btn btn-lg rounded btn-outline-dark shadow-sm"
        >
          What Can I Bring?
        </Link>
      </span>
    </div>
  );
};

export default AirlineFeature;
