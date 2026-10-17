import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditTrip from "./EditTrip";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Destination state
  const [airportCode, setAirportCode] = useState("");
  const [addingDestination, setAddingDestination] = useState(false);
  const [removingDestination, setRemovingDestination] = useState(null);
  const [destinationError, setDestinationError] = useState("");

  // Saved destinations state
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadingSavedDestinations, setLoadingSavedDestinations] =
    useState(true);
  const [savedDestinationsError, setSavedDestinationsError] = useState("");
  const [selectedSavedCode, setSelectedSavedCode] = useState("");

  // Update trip details after editing
  const handleTripUpdated = updatedTrip => {
    setTrip(updatedTrip);
    setIsEditing(false);
  };

  // Add destination manually
  const handleAddDestination = async e => {
    e.preventDefault();

    const code = airportCode.trim().toUpperCase();

    if (!/^[A-Z0-9]{3}$/.test(code)) {
      setDestinationError("Enter a valid three-character airport code.");
      return;
    }

    if (addingDestination || removingDestination !== null) return;

    setAddingDestination(true);
    setDestinationError("");

    try {
      const response = await api.post(`/api/trips/${id}/destinations`, {
        airportCode: code,
      });

      setTrip(response.data.trip);
      setAirportCode("");
    } catch (error) {
      console.error("Unable to add destination:", error);

      setDestinationError(
        error.response?.data?.message ||
          "Unable to add destination. Please try again.",
      );
    } finally {
      setAddingDestination(false);
    }
  };

  // Remove destination from trip
  const handleRemoveDestination = async code => {
    if (removingDestination !== null || addingDestination) return;

    setRemovingDestination(code);
    setDestinationError("");

    try {
      const response = await api.delete(
        `/api/trips/${id}/destinations/${code}`,
      );

      setTrip(response.data.trip);
    } catch (error) {
      console.error("Unable to remove destination:", error);

      setDestinationError(
        error.response?.data?.message ||
          "Unable to remove destination. Please try again.",
      );
    } finally {
      setRemovingDestination(null);
    }
  };

  const handleAddSavedDestination = async () => {
    if (
      !selectedSavedCode ||
      addingDestination ||
      removingDestination !== null
    ) {
      return;
    }

    setAddingDestination(true);
    setDestinationError("");

    try {
      const response = await api.post(`/api/trips/${id}/destinations`, {
        airportCode: selectedSavedCode,
      });

      setTrip(response.data.trip);
      setSelectedSavedCode("");
    } catch (error) {
      console.error("Unable to add saved destination:", error);

      setDestinationError(
        error.response?.data?.message ||
          "Unable to add saved destination. Please try again.",
      );
    } finally {
      setAddingDestination(false);
    }
  };

  // Delete trip from MongoDB
  const handleDeleteTrip = async () => {
    if (deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await api.delete(`/api/trips/${id}`);

      navigate("/my-trips", { replace: true });
    } catch (error) {
      console.error("Unable to delete trip:", error);

      setDeleteError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to delete your trip. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Fetch saved destinations
  useEffect(() => {
    const controller = new AbortController();

    const fetchSavedDestinations = async () => {
      setLoadingSavedDestinations(true);
      setSavedDestinationsError("");

      try {
        const response = await api.get("/api/favorites/destinations", {
          signal: controller.signal,
        });

        setSavedDestinations(response.data.savedDestinations || []);

        // Temporary log for testing
        console.log("Saved destinations:", response.data.savedDestinations);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Unable to fetch saved destinations:", error);

        setSavedDestinationsError("Unable to load your saved destinations.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSavedDestinations(false);
        }
      }
    };

    fetchSavedDestinations();

    return () => controller.abort();
  }, []);

  // Fetch trip details
  useEffect(() => {
    const controller = new AbortController();

    const fetchTrip = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/trips/${id}`, {
          signal: controller.signal,
        });

        setTrip(response.data.trip);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Unable to fetch trip:", error);

        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Unable to load this trip. It may not exist or may no longer be available.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTrip();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="container py-4">
        <p>Loading trip...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>

        <Link to="/my-trips" className="btn btn-outline-primary">
          Back to My Trips
        </Link>
      </main>
    );
  }

  if (!trip) return null;

  // Saved airports that are not already part of this trip
  const availableSavedDestinations = savedDestinations.filter(
    code => !trip.destinations?.includes(code),
  );

  return (
    <main className="container py-4">
      <Link to="/my-trips" className="btn btn-outline-secondary btn-sm mb-4">
        &larr; Back to My Trips
      </Link>

      <section className="border rounded-3 p-4">
        {/* Trip heading and action buttons */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
          <h1 className="fw-bold mb-0">{trip.name}</h1>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setIsEditing(prev => !prev);
                setShowDeleteConfirm(false);
                setDeleteError("");
              }}
              disabled={deleting}
              aria-expanded={isEditing}
            >
              {isEditing ? "Cancel Edit" : "Edit Trip"}
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setShowDeleteConfirm(true);
                setIsEditing(false);
                setDeleteError("");
              }}
              disabled={deleting || showDeleteConfirm}
              aria-expanded={showDeleteConfirm}
            >
              Delete Trip
            </button>
          </div>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="alert alert-danger" role="alert">
            <h2 className="h6">Delete this trip?</h2>

            <p>
              Are you sure you want to delete <strong>{trip.name}</strong>? This
              action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-danger" role="alert">
                {deleteError}
              </p>
            )}

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteTrip}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete Trip"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteError("");
                }}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit trip form */}
        {isEditing && (
          <div className="border rounded-3 p-3 mb-4">
            <h2 className="h5 mb-3">Edit Trip</h2>

            <EditTrip trip={trip} onTripUpdated={handleTripUpdated} />
          </div>
        )}

        {/* Trip information */}
        <div className="mt-3">
          <p className="text-muted">Destination: {trip.destinationCode}</p>

          {trip.startDate && (
            <p>
              <strong>Start:</strong> {trip.startDate.slice(0, 10)}
            </p>
          )}

          {trip.endDate && (
            <p>
              <strong>End:</strong> {trip.endDate.slice(0, 10)}
            </p>
          )}

          {trip.notes && (
            <div className="mt-3">
              <h2 className="h5">Notes</h2>
              <p className="mb-0">{trip.notes}</p>
            </div>
          )}
        </div>

        {/* Destinations associated with this trip */}
        <section className="border-top mt-4 pt-4">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h5 mb-0">Trip Destinations</h2>

            <span className="badge text-bg-secondary">
              {trip.destinations?.length || 0}
            </span>
          </div>

          {/* Select from saved destinations */}
          <div className="mb-4">
            <label htmlFor="saved-destination" className="form-label">
              Choose from Saved Destinations
            </label>

            {loadingSavedDestinations ? (
              <p className="text-muted small">Loading saved destinations...</p>
            ) : savedDestinationsError ? (
              <p className="text-danger small" role="alert">
                {savedDestinationsError}
              </p>
            ) : availableSavedDestinations.length === 0 ? (
              <p className="text-muted small">
                No saved destinations available to add.
              </p>
            ) : (
              <div className="d-flex flex-column flex-sm-row gap-2">
                <select
                  id="saved-destination"
                  className="form-select"
                  value={selectedSavedCode}
                  onChange={e => setSelectedSavedCode(e.target.value)}
                  disabled={addingDestination || removingDestination !== null}
                >
                  <option value="">Select a saved destination</option>

                  {availableSavedDestinations.map(code => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddSavedDestination}
                  disabled={
                    !selectedSavedCode ||
                    addingDestination ||
                    removingDestination !== null
                  }
                >
                  {addingDestination ? "Adding..." : "Add to Trip"}
                </button>
              </div>
            )}
          </div>

          {/* Add destination manually */}
          <form onSubmit={handleAddDestination} className="mb-4">
            <label htmlFor="trip-airport-code" className="form-label">
              Add an airport to this trip
            </label>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <input
                id="trip-airport-code"
                type="text"
                className="form-control"
                placeholder="Enter airport code (e.g. SFO)"
                value={airportCode}
                onChange={e => {
                  setAirportCode(e.target.value.toUpperCase());
                  setDestinationError("");
                }}
                maxLength={3}
                autoComplete="off"
                required
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={addingDestination || removingDestination !== null}
              >
                {addingDestination ? "Adding..." : "Add Destination"}
              </button>
            </div>
          </form>

          {/* Destination errors */}
          {destinationError && (
            <p className="text-danger small mb-3" role="alert">
              {destinationError}
            </p>
          )}

          {/* Display trip destinations */}
          {!trip.destinations?.length ? (
            <p className="text-muted mb-0">
              No additional destinations added to this trip yet.
            </p>
          ) : (
            <ul className="list-group">
              {trip.destinations.map(code => (
                <li
                  key={code}
                  className="list-group-item d-flex justify-content-between align-items-center gap-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span aria-hidden="true">📍</span>
                    <span>{code}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveDestination(code)}
                    disabled={removingDestination !== null || addingDestination}
                    aria-label={`Remove ${code} from trip`}
                  >
                    {removingDestination === code ? "Removing..." : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
