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

      <ul className="dropdown-menu">
        {Array.isArray(airlines) && airlines.length > 0 ? (
          airlines
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(airline => {
              const { slug, name, _id } = airline;

              return (
                <li key={_id}>
                  <Link
                    onClick={e => getAirlineUrl(e)}
                    to={`/airlines/${slug}/destinations`}
                    className="dropdown-item"
                  >
                    {name}
                  </Link>
                </li>
              );
            })
        ) : (
          <li>No airlines available</li>
        )}
      </ul>
    </div>
  );
}
