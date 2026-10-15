import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaFolderOpen,
  FaMapMarkerAlt,
  FaPlane,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import DestinationSearch from "./DestinationSearch";
import AddPlace from "./AddPlace";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import LoadingSpinner from "./LoadingSpinner";

const placeTypeFields = {
  city: ["state", "country"],
  state: ["country"],
  country: [],
  attraction: ["city", "state", "country"],
  other: ["city", "state", "country"],
};

export default function CollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const airlines = useLoaderData();

  const { isLoggedIn, loading: authLoading } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removingCode, setRemovingCode] = useState(null);
  const [removingPlaceId, setRemovingPlaceId] = useState(null);

  // Saved places filter
  const [placeFilter, setPlaceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Inline editing for one custom place at a time
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [savingPlace, setSavingPlace] = useState(false);
  const [placeEditError, setPlaceEditError] = useState("");
  const [placeEditForm, setPlaceEditForm] = useState({
    name: "",
    type: "city",
    city: "",
    state: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Collection editing
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  // Fetch selected collection
  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const fetchCollection = async () => {
      setLoading(true);
      setError("");
      setFormError("");
      setCollection(null);
      setIsEditing(false);
      setPlaceFilter("all");
      setEditingPlaceId(null);
      setPlaceEditError("");

      try {
        const response = await api.get(`/api/collections/${id}`);

        if (active) {
          setCollection(response.data.collection);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Unable to load collection.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCollection();

    return () => {
      active = false;
    };
  }, [id, authLoading, isLoggedIn, navigate]);

  // Build unique destination lookup
  const destinationMap = useMemo(() => {
    const map = new Map();

    if (Array.isArray(airlines)) {
      airlines.forEach(airline => {
        (airline.destinations || []).forEach(destination => {
          const code = destination.airport_code;

          if (code && !map.has(code)) {
            map.set(code, destination);
          }
        });
      });
    }

    return map;
  }, [airlines]);

  // Destinations available for searching
  const availableDestinations = useMemo(() => {
    return Array.from(destinationMap.values()).sort((a, b) =>
      (a.name || "").localeCompare(b.name || ""),
    );
  }, [destinationMap]);

  // Airline destinations saved to collection
  const savedDestinations = (collection?.destinations || []).map(code => ({
    code,
    destination: destinationMap.get(code),
  }));

  // Custom places saved to collection
  const savedPlaces = collection?.places || [];

  // Combine both types for displaying in one section
  const allSavedPlaces = [
    ...savedDestinations.map(({ code, destination }) => ({
      id: `airport-${code}`,
      type: "airline",
      code,
      name: destination?.name || code,
      airportName: destination?.airport_name || "",
      city: destination?.city || "",
      state: destination?.state || "",
    })),

    ...savedPlaces.map(place => ({
      id: `place-${place._id}`,
      type: "custom",
      placeId: place._id,
      name: place.name,
      placeType: place.type,
      city: place.city || "",
      state: place.state || "",
      country: place.country || "",
    })),
  ];

  // Filter, search, and sort the unified list
  const filteredPlaces = allSavedPlaces
    .filter(place => {
      if (placeFilter !== "all" && place.type !== placeFilter) {
        return false;
      }

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const searchableText = [
        place.name,
        place.code,
        place.airportName,
        place.city,
        place.state,
        place.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    })
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Total saved items
  const totalPlaces = allSavedPlaces.length;

  // Add airline destination
  const handleAddDestination = async destination => {
    const code = destination.airport_code;

    if (adding) return;

    setFormError("");
    setError("");

    if (collection?.destinations?.includes(code)) {
      setFormError("This destination is already in your collection.");
      return;
    }

    setAdding(true);

    try {
      const response = await api.post(`/api/collections/${id}/destinations`, {
        airportCode: code,
      });

      setCollection(response.data.collection);
    } catch (err) {
      setFormError(err.response?.data?.message || "Unable to add destination.");
    } finally {
      setAdding(false);
    }
  };

  // Update collection after adding custom place
  const handlePlaceAdded = updatedCollection => {
    setCollection(updatedCollection);
    setError("");
  };

  // Open a custom place's inline edit form
  const handleStartPlaceEdit = place => {
    setEditingPlaceId(place.placeId);
    setPlaceEditForm({
      name: place.name,
      type: place.placeType,
      city: place.city,
      state: place.state,
      country: place.country,
    });
    setPlaceEditError("");
  };

  const handleCancelPlaceEdit = () => {
    if (savingPlace) return;
    setEditingPlaceId(null);
    setPlaceEditError("");
  };

  const handlePlaceEditChange = event => {
    const { name, value } = event.target;

    setPlaceEditForm(previous => {
      if (name === "type") {
        const allowedFields = placeTypeFields[value] || [];

        return {
          ...previous,
          type: value,
          city: allowedFields.includes("city") ? previous.city : "",
          state: allowedFields.includes("state") ? previous.state : "",
          country: allowedFields.includes("country") ? previous.country : "",
        };
      }

      return { ...previous, [name]: value };
    });

    setPlaceEditError("");
  };

  const handleSavePlaceEdit = async event => {
    event.preventDefault();
    if (savingPlace || !editingPlaceId) return;

    const updatedPlace = Object.fromEntries(
      Object.entries(placeEditForm).map(([key, value]) => [key, value.trim()]),
    );

    if (!updatedPlace.name || updatedPlace.name.length > 120) {
      setPlaceEditError("Place name must be 1–120 characters.");
      return;
    }

    if (
      [updatedPlace.city, updatedPlace.state, updatedPlace.country].some(
        value => value.length > 120,
      )
    ) {
      setPlaceEditError("Location fields must be 120 characters or fewer.");
      return;
    }

    setSavingPlace(true);
    setPlaceEditError("");
    try {
      const response = await api.patch(
        `/api/collections/${id}/places/${editingPlaceId}`,
        updatedPlace,
      );
      setCollection(response.data.collection);
      setEditingPlaceId(null);
    } catch (err) {
      setPlaceEditError(
        err.response?.data?.message || "Unable to update place.",
      );
    } finally {
      setSavingPlace(false);
    }
  };

  // Open collection edit form
  const handleStartEdit = () => {
    setEditForm({
      name: collection.name,
      description: collection.description || "",
    });

    setEditError("");
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError("");
  };

  // Update edit inputs
  const handleEditChange = event => {
    const { name, value } = event.target;

    setEditForm(previous => ({
      ...previous,
      [name]: value,
    }));

    setEditError("");
  };

  // Save collection edits
  const handleSaveEdit = async event => {
    event.preventDefault();

    if (savingEdit) return;

    const name = editForm.name.trim();
    const description = editForm.description.trim();

    if (!name) {
      setEditError("Collection name is required.");
      return;
    }

    if (name.length > 80) {
      setEditError("Collection name cannot exceed 80 characters.");
      return;
    }

    if (description.length > 500) {
      setEditError("Description cannot exceed 500 characters.");
      return;
    }

    setSavingEdit(true);
    setEditError("");

    try {
      const response = await api.patch(`/api/collections/${id}`, {
        name,
        description,
      });

      setCollection(response.data.collection);
      setIsEditing(false);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Unable to update collection.",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // Remove airline destination
  const handleRemoveDestination = async code => {
    if (removingCode) return;

    setRemovingCode(code);
    setError("");
    setFormError("");

    try {
      const response = await api.delete(
        `/api/collections/${id}/destinations/${code}`,
      );

      setCollection(response.data.collection);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove destination.");
    } finally {
      setRemovingCode(null);
    }
  };

  // Remove custom place
  const handleRemovePlace = async placeId => {
    if (removingPlaceId || savingPlace) return;

    setRemovingPlaceId(placeId);
    setError("");

    try {
      const response = await api.delete(
        `/api/collections/${id}/places/${placeId}`,
      );

      setCollection(response.data.collection);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove place.");
    } finally {
      setRemovingPlaceId(null);
    }
  };

  // Authentication loading
  if (authLoading || !isLoggedIn) {
    return <LoadingSpinner message="Checking your account..." />;
  }

  // Collection loading
  if (loading) {
    return <LoadingSpinner message="Loading collection..." />;
  }

  // Collection not found or request failed
  if (!collection) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Collection not found."}
        </div>

        <Link to="/collections" className="btn btn-outline-primary">
          Back to Collections
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4 py-md-5">
      {/* Back navigation */}
      <Link
        to="/collections"
        className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
      >
        <FaArrowLeft />
        All Collections
      </Link>

      {/* Collection header */}
      <section className="mb-4">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div className="flex-grow-1">
            <h1 className="h3 mb-2">{collection.name}</h1>

            <p className="text-muted mb-2">
              {collection.description || "Your saved travel destinations."}
            </p>

            <span className="text-muted small">
              {totalPlaces} {totalPlaces === 1 ? "place" : "places"}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
              onClick={isEditing ? handleCancelEdit : handleStartEdit}
              disabled={savingEdit}
              aria-expanded={isEditing}
            >
              <FaEdit />
              {isEditing ? "Cancel Editing" : "Edit Collection"}
            </button>

            <FaFolderOpen className="text-primary flex-shrink-0" size={30} />
          </div>
        </div>

        {/* Edit collection form */}
        {isEditing && (
          <div className="card shadow-sm rounded-3 mt-4">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Edit Collection</h2>

              <form onSubmit={handleSaveEdit}>
                <div className="mb-3">
                  <label
                    htmlFor="editCollectionName"
                    className="form-label fw-semibold"
                  >
                    Collection Name
                  </label>

                  <input
                    id="editCollectionName"
                    type="text"
                    name="name"
                    className="form-control"
                    value={editForm.name}
                    onChange={handleEditChange}
                    maxLength={80}
                    disabled={savingEdit}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="editCollectionDescription"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>

                  <textarea
                    id="editCollectionDescription"
                    name="description"
                    className="form-control"
                    value={editForm.description}
                    onChange={handleEditChange}
                    maxLength={500}
                    rows={3}
                    disabled={savingEdit}
                  />

                  <div className="form-text">
                    {editForm.description.length}/500 characters
                  </div>
                </div>

                {editError && (
                  <div className="alert alert-danger" role="alert">
                    {editError}
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingEdit}
                  >
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelEdit}
                    disabled={savingEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* General errors */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search and add airline destinations */}
      <section className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 mb-2">Add a Destination</h2>

          <p className="text-muted small mb-3">
            Search by city, state, airport name, or airport code.
          </p>

          <DestinationSearch
            destinations={availableDestinations}
            savedCodes={collection.destinations || []}
            onSelect={handleAddDestination}
            disabled={adding}
          />

          {adding && (
            <p className="text-muted small mt-3 mb-0" role="status">
              Adding destination...
            </p>
          )}

          {formError && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {formError}
            </div>
          )}
        </div>
      </section>

      {/* Add custom place */}
      <AddPlace collectionId={id} onPlaceAdded={handlePlaceAdded} />

      {/* Unified saved places */}
      <section className="mt-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h5 mb-1">Saved Places</h2>

            <p className="text-muted small mb-0">
              {totalPlaces} {totalPlaces === 1 ? "place" : "places"} in this
              collection
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          className="d-flex flex-wrap gap-2 mb-4"
          role="group"
          aria-label="Filter saved places"
        >
          {[
            {
              value: "all",
              label: "All",
              count: totalPlaces,
            },
            {
              value: "airline",
              label: "Airline Destinations",
              count: savedDestinations.length,
            },
            {
              value: "custom",
              label: "Custom Places",
              count: savedPlaces.length,
            },
          ].map(filter => (
            <button
              key={filter.value}
              type="button"
              className={`btn btn-sm ${
                placeFilter === filter.value
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setPlaceFilter(filter.value)}
              aria-pressed={placeFilter === filter.value}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Search and sort saved places */}
        <div className="row g-3 align-items-end mb-4">
          <div className="col-12 col-md-8">
            <label
              htmlFor="searchSavedPlaces"
              className="form-label fw-semibold"
            >
              Search Saved Places
            </label>
            <div className="input-group">
              <input
                id="searchSavedPlaces"
                type="search"
                className="form-control"
                placeholder="Search places, cities, states, or airport codes..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="sortSavedPlaces" className="form-label fw-semibold">
              Sort by
            </label>
            <select
              id="sortSavedPlaces"
              className="form-select"
              value={sortOrder}
              onChange={event => setSortOrder(event.target.value)}
            >
              <option value="asc">Name: A–Z</option>
              <option value="desc">Name: Z–A</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredPlaces.length === 0 ? (
          <div className="border rounded-3 p-4 text-center">
            <FaMapMarkerAlt size={28} className="text-secondary mb-3" />

            <h3 className="h6">
              {searchQuery.trim()
                ? "No saved places match your search"
                : totalPlaces === 0
                  ? "No saved places yet"
                  : "No places match this filter"}
            </h3>

            <p className="text-muted mb-0">
              {searchQuery.trim()
                ? "Try a different search term or clear your search."
                : totalPlaces === 0
                  ? "Add an airline destination or custom place above to start your collection."
                  : "Try selecting another filter to view your saved places."}
            </p>

            {searchQuery.trim() && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-3"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {filteredPlaces.map(place => {
              const isAirline = place.type === "airline";

              const isRemoving = isAirline
                ? removingCode === place.code
                : removingPlaceId === place.placeId;

              const location = [
                place.city,
                place.state,
                !isAirline && place.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <div className="col-12 col-lg-6" key={place.id}>
                  <article className="card h-100 shadow-sm rounded-3">
                    <div className="card-body p-3 p-md-4">
                      <div className="d-flex align-items-start gap-3">
                        {/* Icon */}
                        <div className="text-primary flex-shrink-0 pt-1">
                          {isAirline ? (
                            <FaPlane size={20} />
                          ) : (
                            <FaMapMarkerAlt size={20} />
                          )}
                        </div>

                        {/* Details */}
                        <div
                          className="flex-grow-1"
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <h3 className="h5 mb-2 text-break">
                            {place.name}
                            {isAirline && ` — ${place.code}`}
                          </h3>

                          <span className="badge text-bg-light border text-capitalize mb-2">
                            {isAirline
                              ? "Airline Destination"
                              : place.placeType || "Custom Place"}
                          </span>

                          {isAirline && place.airportName && (
                            <p className="text-muted small mb-2">
                              <FaPlane className="me-2" />
                              {place.airportName}
                            </p>
                          )}

                          {location && (
                            <p className="text-muted small mb-0 text-break">
                              <FaMapMarkerAlt className="me-2" />
                              {location}
                            </p>
                          )}

                          {isAirline && !place.airportName && !location && (
                            <p className="text-muted small mb-0">
                              Destination information unavailable.
                            </p>
                          )}
                        </div>

                        {/* Custom places can be edited */}
                        {!isAirline && (
                          <button
                            type="button"
                            className="btn btn-link text-primary p-1 flex-shrink-0"
                            onClick={() =>
                              editingPlaceId === place.placeId
                                ? handleCancelPlaceEdit()
                                : handleStartPlaceEdit(place)
                            }
                            disabled={Boolean(
                              savingPlace || removingCode || removingPlaceId,
                            )}
                            aria-label={`Edit ${place.name}`}
                            aria-expanded={editingPlaceId === place.placeId}
                            title="Edit place"
                          >
                            <FaEdit size={17} />
                          </button>
                        )}

                        {/* Remove */}
                        <button
                          type="button"
                          className="btn btn-link text-danger p-1 flex-shrink-0"
                          onClick={() =>
                            isAirline
                              ? handleRemoveDestination(place.code)
                              : handleRemovePlace(place.placeId)
                          }
                          disabled={Boolean(
                            removingCode ||
                            removingPlaceId ||
                            savingPlace ||
                            editingPlaceId,
                          )}
                          aria-label={`Remove ${place.name} from collection`}
                          title="Remove place"
                        >
                          {isRemoving ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaTrash size={17} />
                          )}
                        </button>
                      </div>

                      {/* Inline edit form for a custom place */}
                      {!isAirline && editingPlaceId === place.placeId && (
                        <form
                          onSubmit={handleSavePlaceEdit}
                          className="border-top mt-3 pt-3"
                        >
                          <h4 className="h6 mb-3">Edit Custom Place</h4>
                          <div className="row g-3">
                            <div className="col-12 col-md-6">
                              <label
                                htmlFor={`place-name-${place.placeId}`}
                                className="form-label"
                              >
                                Place Name
                              </label>
                              <input
                                id={`place-name-${place.placeId}`}
                                name="name"
                                type="text"
                                className="form-control"
                                value={placeEditForm.name}
                                onChange={handlePlaceEditChange}
                                maxLength={120}
                                required
                                disabled={savingPlace}
                              />
                            </div>
                            <div className="col-12 col-md-6">
                              <label
                                htmlFor={`place-type-${place.placeId}`}
                                className="form-label"
                              >
                                Place Type
                              </label>
                              <select
                                id={`place-type-${place.placeId}`}
                                name="type"
                                className="form-select"
                                value={placeEditForm.type}
                                onChange={handlePlaceEditChange}
                                disabled={savingPlace}
                              >
                                <option value="city">City</option>
                                <option value="state">State</option>
                                <option value="country">Country</option>
                                <option value="attraction">Attraction</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            {[
                              { name: "city", label: "City (optional)" },
                              {
                                name: "state",
                                label: "State / Region (optional)",
                              },
                              { name: "country", label: "Country (optional)" },
                            ]
                              .filter(field =>
                                (
                                  placeTypeFields[placeEditForm.type] || []
                                ).includes(field.name),
                              )
                              .map(field => (
                                <div
                                  className="col-12 col-md-4"
                                  key={field.name}
                                >
                                  <label
                                    htmlFor={`place-${field.name}-${place.placeId}`}
                                    className="form-label"
                                  >
                                    {field.label}
                                  </label>
                                  <input
                                    id={`place-${field.name}-${place.placeId}`}
                                    name={field.name}
                                    type="text"
                                    className="form-control"
                                    value={placeEditForm[field.name]}
                                    onChange={handlePlaceEditChange}
                                    maxLength={120}
                                    disabled={savingPlace}
                                  />
                                </div>
                              ))}
                          </div>

                          {placeEditError && (
                            <div
                              className="alert alert-danger mt-3 mb-0"
                              role="alert"
                            >
                              {placeEditError}
                            </div>
                          )}
                          <div className="d-flex flex-wrap gap-2 mt-3">
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm"
                              disabled={savingPlace}
                            >
                              {savingPlace ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={handleCancelPlaceEdit}
                              disabled={savingPlace}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
