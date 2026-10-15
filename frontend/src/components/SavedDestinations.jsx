import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MdOutlineLocalAirport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

import AddToCollection from "./AddToCollection";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function SavedDestinations() {
  const navigate = useNavigate();
  const airlines = useLoaderData();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [savedCodes, setSavedCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingCode, setRemovingCode] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const fetchFavorites = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/favorites/destinations");

        if (active) {
          setSavedCodes(response.data.savedDestinations || []);
        }
      } catch (err) {
        if (active) {
          setError("Unable to load saved destinations.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      active = false;
    };
  }, [isLoggedIn, authLoading, navigate]);

  // Combine destinations from all airlines,
  // removing duplicate airport codes.
  const allDestinations = Array.isArray(airlines)
    ? airlines.flatMap(airline => airline.destinations || [])
    : [];

  const uniqueDestinations = [
    ...new Map(
      allDestinations.map(destination => [
        destination.airport_code,
        destination,
      ]),
    ).values(),
  ];

  const savedDestinations = uniqueDestinations.filter(destination =>
    savedCodes.includes(destination.airport_code),
  );

  // Find all airlines serving a destination
  const getAirlinesForDestination = airportCode => {
    if (!Array.isArray(airlines)) return [];

    return airlines.filter(airline =>
      airline.destinations?.some(
        destination => destination.airport_code === airportCode,
      ),
    );
  };

  // Remove destination from favorites
  const handleRemove = async airportCode => {
    if (removingCode) return;

    setRemovingCode(airportCode);
    setError("");

    try {
      const response = await api.delete(
        `/api/favorites/destinations/${airportCode}`,
      );

      setSavedCodes(response.data.savedDestinations || []);
    } catch (err) {
      setError("Unable to remove destination.");
    } finally {
      setRemovingCode(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="container py-5">
        <p>Loading saved destinations...</p>
      </main>
    );
  }

  return (
    <main className="container py-4">
      {/* Page heading */}
      <div className="mb-4">
        <h1>Saved Destinations</h1>

        <p className="text-muted">
          Your favorite destinations and the airlines that serve them.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {savedDestinations.length === 0 && !error ? (
        <div className="border rounded-3 p-4 text-center">
          <FaHeart className="text-secondary mb-3" size={28} />

          <h2 className="h5">No saved destinations yet</h2>

          <p className="text-muted">
            Explore airlines and save destinations using the heart icon.
          </p>

          <Link to="/airlines" className="btn btn-primary">
            Explore Airlines
          </Link>
        </div>
      ) : (
        <>
          {/* Saved destination count */}
          <p className="fw-semibold mb-3">
            {savedDestinations.length}{" "}
            {savedDestinations.length === 1
              ? "destination saved"
              : "destinations saved"}
          </p>

          <div className="row g-3">
            {savedDestinations.map(destination => {
              const airportCode = destination.airport_code;

              const servingAirlines = getAirlinesForDestination(airportCode);

              return (
                <div className="col-12 col-lg-6" key={airportCode}>
                  <article className="card h-100 shadow-sm border-1 rounded-3">
                    <div className="card-body d-flex flex-column">
                      {/* Destination heading */}
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <h2 className="h5 mb-1">{destination.name}</h2>

                          <p className="text-muted small mb-0">
                            <FaLocationDot className="me-2" />
                            {destination.city}
                            {destination.state ? `, ${destination.state}` : ""}
                          </p>
                        </div>

                        {/* Remove favorite */}
                        <button
                          type="button"
                          className="btn btn-link border-0 p-2"
                          onClick={() => handleRemove(airportCode)}
                          disabled={Boolean(removingCode)}
                          aria-label={`Remove ${destination.name} from saved destinations`}
                          title="Remove saved destination"
                        >
                          {removingCode === airportCode ? (
                            <span
                              className="spinner-border spinner-border-sm text-danger"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaHeart className="text-danger" size={20} />
                          )}
                        </button>
                      </div>

                      {/* Airport information */}
                      <div className="mt-3">
                        <p className="mb-1">
                          <strong>{airportCode}</strong>
                        </p>

                        <p className="text-muted small mb-0">
                          <MdOutlineLocalAirport className="me-2" />
                          {destination.airport_name}
                        </p>
                      </div>

                      <hr className="my-3" />

                      {/* Airlines serving this destination */}
                      <div>
                        <h3 className="h6 mb-2">
                          Airlines serving this destination
                          <span className="text-muted ms-2">
                            ({servingAirlines.length})
                          </span>
                        </h3>

                        {servingAirlines.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {servingAirlines.map(airline => (
                              <Link
                                key={airline._id || airline.slug}
                                to={`/airlines/${airline.slug}`}
                                className="badge rounded-pill text-bg-light border text-decoration-none p-2"
                              >
                                {airline.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted small mb-0">
                            No airline information available.
                          </p>
                        )}
                      </div>

                      {/* Collection action */}
                      <div className="mt-auto pt-4">
                        <div className="border-top pt-3 d-flex justify-content-end">
                          <AddToCollection destination={destination} />
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
