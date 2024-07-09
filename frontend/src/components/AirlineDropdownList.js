import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AirlineDropdownList({ getAirlineUrl, destinations }) {
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

  const sortedAirlines = airlines.map(airline => {
    const { slug, name, _id } = airline;

    return (
      <li key={`${name}-${_id}`}>
        <Link
          onClick={e => getAirlineUrl(e)}
          to={`/airlines/${slug}/destinations`}
          className="dropdown-item"
        >
          {name}
        </Link>
      </li>
    );
  });

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
      <ul className="dropdown-menu">{sortedAirlines}</ul>
    </div>
  );
}
