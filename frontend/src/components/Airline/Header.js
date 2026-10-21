import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Destinations from "./Destinations";
import StateDropDownList from "./StateDropDownList";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const Featured = ({ airlines = [], slug }) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuth();

  // Existing destination filters
  const [destinationView, setDestinationView] = useState("all");
  const [selectedState, setSelectedState] = useState("");

  // Saved Airlines state
  const [savedAirlines, setSavedAirlines] = useState([]);
  const [savingAirline, setSavingAirline] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState("");

  // Fetch saved airlines
  useEffect(() => {
    let active = true;

    const fetchSavedAirlines = async () => {
      if (authLoading) return;

      if (!isLoggedIn) {
        setSavedAirlines([]);
        setFavoritesLoading(false);
        return;
      }

      setFavoritesLoading(true);
      setFavoritesError("");

      try {
        const response = await api.get("/api/favorites/airlines");

        if (active) {
          setSavedAirlines(response.data.savedAirlines || []);
        }
      } catch (error) {
        if (active) {
          setFavoritesError("Unable to load saved airlines.");
        }
      } finally {
        if (active) {
          setFavoritesLoading(false);
        }
      }
    };

    fetchSavedAirlines();

    return () => {
      active = false;
    };
  }, [isLoggedIn, authLoading]);

  // Save or remove airline
  const handleSaveAirline = async airlineSlug => {
    if (authLoading || favoritesLoading || savingAirline) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setSavingAirline(true);
    setFavoritesError("");

    const isSaved = savedAirlines.includes(airlineSlug);

    try {
      const response = isSaved
        ? await api.delete(`/api/favorites/airlines/${airlineSlug}`)
        : await api.post("/api/favorites/airlines", {
            airlineSlug,
          });

      setSavedAirlines(response.data.savedAirlines || []);
    } catch (error) {
      setFavoritesError("Unable to update saved airline.");
    } finally {
      setSavingAirline(false);
    }
  };

  // Find selected airline
  const airline = airlines.find(airline => airline.slug === slug);

  // Hooks have all been called, so conditional return is safe
  if (!airline) {
    return <p>Airline not found.</p>;
  }

  const destinations = airline.destinations || [];

  // Filter domestic / international destinations
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

  // Filter by state
  const filteredDestinations = viewFilteredDestinations.filter(destination => {
    if (!selectedState) return true;

    return destination.state === selectedState;
  });

  // Sort alphabetically by airport code
  const sortedDestinations = [...filteredDestinations].sort((a, b) =>
    a.airport_code.localeCompare(b.airport_code),
  );

  const handleViewChange = view => {
    setDestinationView(view);
    setSelectedState("");
  };

  const isSaved = savedAirlines.includes(airline.slug);

  console.log("Airline slug:", airline.slug);
  console.log("Saved airlines:", savedAirlines);
  console.log("Is saved:", isSaved);

  return (
    <article className="p-3 my-3">
      <div className="mb-3 p-3 shadow-sm rounded-3">
        {/* Airline logo and Save button */}
        <Link className="btn btn-outline-primary btn-sm mb-3" to="/">
          Back
        </Link>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <img
            src={`/${airline.logo}.png`}
            alt={airline.name}
            style={{
              width: "100%",
              maxWidth: "150px",
              height: "auto",
              objectFit: "contain",
            }}
          />

          <button
            type="button"
            className="btn btn-link border-0 p-2"
            onClick={() => handleSaveAirline(airline.slug)}
            disabled={authLoading || favoritesLoading || savingAirline}
            aria-label={
              isSaved
                ? `Remove ${airline.name} from saved airlines`
                : `Save ${airline.name}`
            }
            aria-pressed={isSaved}
            title={isSaved ? "Remove from saved airlines" : "Save airline"}
          >
            {isSaved ? (
              <FaHeart className="text-danger" size={24} />
            ) : (
              <FaRegHeart className="text-secondary" size={24} />
            )}
          </button>
        </div>

        {/* Favorites error */}
        {favoritesError && (
          <div className="alert alert-danger mt-3" role="alert">
            {favoritesError}
          </div>
        )}

        {/* Airline website */}
        <div className="mt-3">
          <Link to={airline.website} target="_blank" rel="noopener noreferrer">
            {airline.website}
          </Link>
        </div>

        {/* Destination count */}
        <h4 className="mt-3">
          Total Destinations: {sortedDestinations.length}
        </h4>

        {/* Destination filters */}
        <div className="d-flex flex-wrap gap-2 my-3">
          <button
            type="button"
            className={`btn btn-md ${
              destinationView === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleViewChange("all")}
          >
            All
          </button>

          <button
            type="button"
            className={`btn btn-md ${
              destinationView === "domestic"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleViewChange("domestic")}
          >
            Domestic
          </button>

          <button
            type="button"
            className={`btn btn-md ${
              destinationView === "international"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleViewChange("international")}
          >
            International
          </button>
        </div>

        {/* State dropdown */}
        <StateDropDownList
          destinations={viewFilteredDestinations}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
        />
      </div>

      {/* Destination table */}
      {sortedDestinations.length > 0 ? (
        <Destinations destinations={sortedDestinations} />
      ) : (
        <h4 className="text-muted my-3">No destinations found.</h4>
      )}
    </article>
  );
};

export default Featured;
