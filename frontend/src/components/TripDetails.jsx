import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditTrip from "./EditTrip";
import DestinationSearch from "./DestinationSearch";

const initialDestination = {
  name: "",
  type: "city",
  city: "",
  state: "",
  country: "",
  airportCode: "",
};

const destinationTypes = [
  { value: "city", label: "City" },
  { value: "airport", label: "Airport" },
  { value: "attraction", label: "Attraction" },
  { value: "region", label: "State / Region" },
  { value: "custom", label: "Custom Place" },
];

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

  // Flexible destination state
  const [destination, setDestination] = useState(initialDestination);
  const [addingDestination, setAddingDestination] = useState(false);
  const [removingDestination, setRemovingDestination] = useState(null);
  const [destinationError, setDestinationError] = useState("");

  const handleTripUpdated = updatedTrip => {
    setTrip(updatedTrip);
    setIsEditing(false);
  };

  const handleDestinationChange = e => {
    const { name, value } = e.target;

    setDestination(prev => ({
      ...prev,
      [name]: value,
    }));

    setDestinationError("");
  };

  // Populate the form when an airport is selected from search
  const handleSelectAirport = selectedAirport => {
    setDestination({
      name: selectedAirport.airport_name || selectedAirport.name || "",
      type: "airport",
      city: selectedAirport.city || "",
      state: selectedAirport.state || "",
      country: "",
      airportCode: selectedAirport.airport_code || "",
    });

    setDestinationError("");
  };

  // Add a flexible destination
  const handleAddDestination = async e => {
    e.preventDefault();

    if (addingDestination || removingDestination !== null) return;

    const name = destination.name.trim();

    if (!name || name.length > 150) {
      setDestinationError(
        "Destination name must be between 1 and 150 characters.",
      );
      return;
    }

    const code = destination.airportCode.trim().toUpperCase();

    if (code && !/^[A-Z0-9]{3}$/.test(code)) {
      setDestinationError("Airport code must contain three characters.");
      return;
    }

    setAddingDestination(true);
    setDestinationError("");

    try {
      const response = await api.post(`/api/trips/${id}/stops`, {
        ...destination,
        name,
        city: destination.city.trim(),
        state: destination.state.trim(),
        country: destination.country.trim(),
        airportCode: code,
      });

      setTrip(response.data.trip);
      setDestination({ ...initialDestination });
    } catch (error) {
      console.error("Unable to add destination:", error);

      setDestinationError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to add destination. Please try again.",
      );
    } finally {
      setAddingDestination(false);
    }
  };

  // Remove a flexible destination
  const handleRemoveStop = async stopId => {
    if (removingDestination !== null || addingDestination) return;

    setRemovingDestination(stopId);
    setDestinationError("");

    try {
      const response = await api.delete(`/api/trips/${id}/stops/${stopId}`);

      setTrip(response.data.trip);
    } catch (error) {
      console.error("Unable to remove destination:", error);

      setDestinationError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to remove destination.",
      );
    } finally {
      setRemovingDestination(null);
    }
  };

  // Remove a legacy airport-code destination
  const handleRemoveLegacyDestination = async code => {
    if (removingDestination !== null || addingDestination) return;

    setRemovingDestination(code);
    setDestinationError("");

    try {
      const response = await api.delete(
        `/api/trips/${id}/destinations/${code}`,
      );

      setTrip(response.data.trip);
    } catch (error) {
      console.error("Unable to remove airport:", error);

      setDestinationError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to remove airport.",
      );
    } finally {
      setRemovingDestination(null);
    }
  };

  // Delete trip
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
            "Unable to load this trip.",
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

  const tripStops = trip.tripStops || [];
  const legacyDestinations = trip.destinations || [];

  const destinationCount = tripStops.length + legacyDestinations.length;

  const isDestinationBusy = addingDestination || removingDestination !== null;

  return (
    <main className="container py-4">
      <Link to="/my-trips" className="btn btn-outline-secondary btn-sm mb-4">
        &larr; Back to My Trips
      </Link>

      <section className="border rounded-3 p-4">
        {/* Trip heading and actions */}
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

        {/* Edit trip */}
        {isEditing && (
          <div className="border rounded-3 p-3 mb-4">
            <h2 className="h5 mb-3">Edit Trip</h2>

            <EditTrip trip={trip} onTripUpdated={handleTripUpdated} />
          </div>
        )}

        {/* Trip information */}
        <div className="mt-3">
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

        {/* Trip destinations */}
        <section className="border-top mt-4 pt-4">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h5 mb-0">Trip Destinations</h2>

            <span className="badge text-bg-secondary">{destinationCount}</span>
          </div>

          {/* Search existing airports */}
          <div className="mb-4">
            <DestinationSearch
              mode="trip"
              onSelect={handleSelectAirport}
              disabled={isDestinationBusy}
            />
          </div>

          {/* Unified destination form */}
          <form
            onSubmit={handleAddDestination}
            className="border rounded-3 p-3 mb-4"
          >
            <h3 className="h6 mb-3">Add Destination</h3>

            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label htmlFor="destination-name" className="form-label">
                  Destination Name
                </label>

                <input
                  id="destination-name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Phoenix or Grand Canyon"
                  value={destination.name}
                  onChange={handleDestinationChange}
                  maxLength={150}
                  required
                  disabled={isDestinationBusy}
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="destination-type" className="form-label">
                  Destination Type
                </label>

                <select
                  id="destination-type"
                  name="type"
                  className="form-select"
                  value={destination.type}
                  onChange={handleDestinationChange}
                  disabled={isDestinationBusy}
                >
                  {destinationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="destination-city" className="form-label">
                  City (Optional)
                </label>

                <input
                  id="destination-city"
                  name="city"
                  type="text"
                  className="form-control"
                  value={destination.city}
                  onChange={handleDestinationChange}
                  maxLength={150}
                  disabled={isDestinationBusy}
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="destination-state" className="form-label">
                  State / Region (Optional)
                </label>

                <input
                  id="destination-state"
                  name="state"
                  type="text"
                  className="form-control"
                  value={destination.state}
                  onChange={handleDestinationChange}
                  maxLength={150}
                  disabled={isDestinationBusy}
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="destination-country" className="form-label">
                  Country (Optional)
                </label>

                <input
                  id="destination-country"
                  name="country"
                  type="text"
                  className="form-control"
                  value={destination.country}
                  onChange={handleDestinationChange}
                  maxLength={150}
                  disabled={isDestinationBusy}
                />
              </div>

              {destination.type === "airport" && (
                <div className="col-12 col-md-4">
                  <label
                    htmlFor="destination-airport-code"
                    className="form-label"
                  >
                    Airport Code (Optional)
                  </label>

                  <input
                    id="destination-airport-code"
                    name="airportCode"
                    type="text"
                    className="form-control"
                    placeholder="e.g. PHX"
                    value={destination.airportCode}
                    onChange={handleDestinationChange}
                    maxLength={3}
                    disabled={isDestinationBusy}
                  />
                </div>
              )}
            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isDestinationBusy}
              >
                {addingDestination ? "Adding..." : "Add Destination"}
              </button>
            </div>
          </form>

          {/* Destination errors */}
          {destinationError && (
            <p className="text-danger small" role="alert">
              {destinationError}
            </p>
          )}

          {/* Display flexible and legacy destinations */}
          {destinationCount === 0 ? (
            <p className="text-muted">
              No destinations added to this trip yet.
            </p>
          ) : (
            <ul className="list-group">
              {tripStops.map(stop => (
                <li
                  key={stop._id}
                  className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
                >
                  <div>
                    <div className="fw-semibold">📍 {stop.name}</div>

                    <div className="text-muted small">
                      {destinationTypes.find(type => type.value === stop.type)
                        ?.label || stop.type}

                      {[stop.city, stop.state, stop.country].filter(Boolean)
                        .length > 0 && (
                        <span>
                          {" · "}
                          {[stop.city, stop.state, stop.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}

                      {stop.airportCode && (
                        <span>
                          {" · "}
                          {stop.airportCode}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveStop(stop._id)}
                    disabled={isDestinationBusy}
                    aria-label={`Remove ${stop.name} from trip`}
                  >
                    {removingDestination === stop._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </li>
              ))}

              {legacyDestinations.map(code => (
                <li
                  key={`legacy-${code}`}
                  className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
                >
                  <div>
                    <div className="fw-semibold">📍 {code}</div>

                    <div className="text-muted small">
                      Airport · Previously saved destination
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveLegacyDestination(code)}
                    disabled={isDestinationBusy}
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
