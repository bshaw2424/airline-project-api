import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlineLocalAirport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import AddToCollection from "../AddToCollection";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const Destinations = ({ destinations = [] }) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  const [savedDestinations, setSavedDestinations] = useState([]);
  const [savingCode, setSavingCode] = useState(null);
  const [error, setError] = useState("");

  // Fetch saved destinations when logged in
  useEffect(() => {
    let active = true;

    const fetchFavorites = async () => {
      if (loading) return;

      if (!isLoggedIn) {
        setSavedDestinations([]);
        return;
      }

      try {
        const response = await api.get("/api/favorites/destinations");

        if (active) {
          setSavedDestinations(response.data.savedDestinations || []);
        }
      } catch (err) {
        if (active) {
          setError("Unable to load saved destinations.");
        }
      }
    };

    fetchFavorites();

    return () => {
      active = false;
    };
  }, [isLoggedIn, loading]);

  // Save or remove a destination from favorites
  const handleSaveDestination = async airportCode => {
    if (loading) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (savingCode) return;

    setError("");
    setSavingCode(airportCode);

    const isSaved = savedDestinations.includes(airportCode);

    try {
      const response = isSaved
        ? await api.delete(`/api/favorites/destinations/${airportCode}`)
        : await api.post("/api/favorites/destinations", { airportCode });

      setSavedDestinations(response.data.savedDestinations || []);
    } catch (err) {
      setError("Unable to update saved destinations.");
    } finally {
      setSavingCode(null);
    }
  };

  // Shared favorite button for both layouts
  const renderSaveButton = destination => {
    const airportCode = destination.airport_code;
    const isSaved = savedDestinations.includes(airportCode);
    const isSaving = savingCode === airportCode;

    return (
      <button
        type="button"
        className="btn btn-link p-2 border-0"
        onClick={() => handleSaveDestination(airportCode)}
        disabled={loading || Boolean(savingCode)}
        aria-label={
          isSaved
            ? `Remove ${destination.name} from saved destinations`
            : `Save ${destination.name}`
        }
        aria-pressed={isSaved}
        title={isSaved ? "Remove from saved destinations" : "Save destination"}
      >
        {isSaving ? (
          <span
            className="spinner-border spinner-border-sm text-primary"
            aria-hidden="true"
          />
        ) : isSaved ? (
          <FaHeart className="text-danger" size={19} />
        ) : (
          <FaRegHeart className="text-secondary" size={19} />
        )}
      </button>
    );
  };

  return (
    <article className="my-3">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {destinations.length === 0 ? (
        <div className="border rounded-3 p-4 text-center">
          <p className="text-muted mb-0">No destinations found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table: 992px and wider */}
          <div className="d-none d-lg-block">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Destination</th>

                    <th scope="col">Code</th>

                    <th scope="col">
                      <MdOutlineLocalAirport className="me-2" />
                      Airport
                    </th>

                    <th scope="col">
                      <FaLocationDot className="me-2" />
                      Location
                    </th>

                    <th scope="col">Collection</th>

                    <th scope="col" className="text-center">
                      Save
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {destinations.map(destination => {
                    const airportCode = destination.airport_code;

                    return (
                      <tr key={destination._id || airportCode}>
                        <td>{destination.name}</td>

                        <td>
                          <strong>{airportCode}</strong>
                        </td>

                        <td>{destination.airport_name}</td>

                        <td>
                          {[destination.city, destination.state]
                            .filter(Boolean)
                            .join(", ")}
                        </td>

                        <td>
                          <AddToCollection destination={destination} />
                        </td>

                        <td className="text-center">
                          {renderSaveButton(destination)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile and tablet cards: below 992px */}
          <div className="d-lg-none">
            <div className="row g-3">
              {destinations.map(destination => {
                const airportCode = destination.airport_code;

                return (
                  <div
                    className="col-12 col-md-6"
                    key={destination._id || airportCode}
                  >
                    <div className="card h-100 shadow-sm rounded-3">
                      <div className="card-body p-3 d-flex flex-column">
                        {/* Destination heading */}
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div className="flex-grow-1">
                            <h3 className="h6 fw-semibold mb-1">
                              {destination.name}
                            </h3>

                            <span className="badge text-bg-light border">
                              {airportCode}
                            </span>
                          </div>

                          {renderSaveButton(destination)}
                        </div>

                        {/* Airport information */}
                        <div className="mt-3">
                          <p className="small text-muted mb-2">
                            <MdOutlineLocalAirport className="me-2" />
                            {destination.airport_name}
                          </p>

                          <p className="small text-muted mb-0">
                            <FaLocationDot className="me-2" />
                            {[destination.city, destination.state]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>

                        {/* Collection action */}
                        <div className="mt-auto pt-3">
                          <div className="border-top pt-3 d-flex justify-content-end">
                            <AddToCollection destination={destination} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </article>
  );
};

export default Destinations;
