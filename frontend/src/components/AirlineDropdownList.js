import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AirlineDropdownList({ getAirlineUrl }) {
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/api/airlines`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setAirlines(response.data);
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch(e => console.log(e.message));
  }, []);
  console.log(airlines.map(a => a.slug));
  const sortedAirlines = (
    <ul className="dropdown-menu">
      {Array.isArray(airlines) && airlines.length > 0 ? (
        airlines
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(airline => {
            // const { slug, name, _id } = airline;

            return (
              <li key={airline._id}>
                <Link
                  onClick={e => getAirlineUrl(e)}
                  to={`/airlines/${airline.slug}/destinations`}
                  className="dropdown-item"
                >
                  {airline.name}
                </Link>
              </li>
            );
          })
      ) : (
        <li>No airlines available</li>
      )}
    </ul>
  );

  return (
    <div className="dropdown">
      <button
        className="btn dropdown-toggle width my-sm-2"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ outline: "1px solid blue" }}
      >
        Change Airline
      </button>
      {sortedAirlines}
    </div>
  );
}
