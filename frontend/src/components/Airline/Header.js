import React, { useState } from "react";
import Destinations from "./Destinations";
import StateDropDownList from "./StateDropDownList";
import { Link } from "react-router-dom";

const Featured = ({ airlines = [], slug }) => {
  const [destinationView, setDestinationView] = useState("all");
  const [selectedState, setSelectedState] = useState("");

  const airline = airlines.find(airline => airline.slug === slug);

  if (!airline) {
    return <p>Airline not found.</p>;
  }

  const destinations = airline.destinations || [];

  // Filter by domestic or international
  const viewFilteredDestinations = destinations.filter(destination => {
    const isInternational =
      String(destination.international).toLowerCase() === "true";

    if (destinationView === "domestic") {
      return !isInternational;
    }

    if (destinationView === "international") {
      return isInternational;
    }

    return true;
  });

  // Filter by selected state
  const filteredDestinations = viewFilteredDestinations.filter(destination => {
    if (!selectedState) return true;

    return destination.state === selectedState;
  });

  // Sort destinations alphabetically by airport code
  const sortedDestinations = [...filteredDestinations].sort((a, b) =>
    a.airport_code.localeCompare(b.airport_code),
  );

  const handleViewChange = view => {
    setDestinationView(view);
    setSelectedState("");
  };

  return (
    <article className="border border-1 rounded-3 p-3 my-3">
      <div className="mb-3">
        <Link to={"/"}>
          <img
            src={`/${airline.logo}.png`}
            alt={airline.name}
            style={{
              width: "15%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        <div className="mt-3">
          <Link to={airline.website} target="_blank" rel="noopener noreferrer">
            {airline.website}
          </Link>
        </div>
      </div>

      <h5>Total Destinations: {sortedDestinations.length}</h5>

      <div className="d-flex gap-2 my-3">
        <button
          className={`btn btn-sm ${
            destinationView === "all" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleViewChange("all")}
        >
          All
        </button>

        <button
          className={`btn btn-sm ${
            destinationView === "domestic"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => handleViewChange("domestic")}
        >
          Domestic
        </button>

        <button
          className={`btn btn-sm ${
            destinationView === "international"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => handleViewChange("international")}
        >
          International
        </button>
      </div>

      <StateDropDownList
        destinations={viewFilteredDestinations}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
      />

      {sortedDestinations.length > 0 ? (
        <Destinations destinations={sortedDestinations} />
      ) : (
        <p className="text-muted my-3">No destinations found.</p>
      )}
    </article>
  );
};

export default Featured;
