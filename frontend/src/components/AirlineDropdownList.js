import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AirlineDropdownList({ getAirlineUrl }) {
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    axios
      .get(`https://whale-app-v8vd4.ondigitalocean.app/api/airlines`)
      .then(response => {
        setAirlines(response.data);
      })
      .catch(e => console.log(e.message));
  }, []);

  return (
    <>
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
          {airlines
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(airlineNames => {
              const { slug, name, _id } = airlineNames;

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
            })}
        </ul>
      </div>
    </>
  );
}
