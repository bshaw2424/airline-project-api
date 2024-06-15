import { Link } from "react-router-dom";
const AirlineFeature = ({ link }) => {
  // const marginClass = isLast ? "me-0" : "me-5";
  return (
    <div
      className={`d-flex  justify-content-center align-items-center flex-column airline-feature`}
      style={{
        fontSize: "1.2em",
      }}
    >
      <h2
        className="text-center pb-4 mb-4 border-bottom border-dark"
        style={{ fontSize: "3rem" }}
      >
        Discover what items are <span className="text-danger">Prohibited</span>{" "}
        and what items are <span className="text-success">Acceptable</span> for
        carry-on and checked luggage before arriving at the airport.
      </h2>
      <span>
        <Link
          to={link}
          target="_blank"
          rel="noreferrer"
          alt="TSA - What Can I Bring Resource List"
          className="btn btn-lg rounded btn-dark"
        >
          What Can I Bring?
        </Link>
      </span>
    </div>
  );
};

export default AirlineFeature;
