import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

import {
  FaFolderOpen,
  FaPlus,
  FaTrash,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import LoadingSpinner from "./LoadingSpinner";

export default function Collections() {
  const navigate = useNavigate();
  const airlines = useLoaderData();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // Build a destination lookup using airport codes
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

  // Fetch collections
  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const fetchCollections = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/collections");

        if (active) {
          setCollections(response.data.collections || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load collections.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCollections();

    return () => {
      active = false;
    };
  }, [authLoading, isLoggedIn, navigate]);

  // Update create collection form
  const handleChange = event => {
    const { name, value } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  // Create a collection
  const handleCreate = async event => {
    event.preventDefault();

    if (creating) return;

    const name = form.name.trim();

    if (!name) {
      setFormError("Please enter a collection name.");
      return;
    }

    if (name.length > 80) {
      setFormError("Collection name cannot exceed 80 characters.");
      return;
    }

    const description = form.description.trim();

    if (description.length > 500) {
      setFormError("Description cannot exceed 500 characters.");
      return;
    }

    setCreating(true);
    setFormError("");

    try {
      const response = await api.post("/api/collections", {
        name,
        description,
      });

      setCollections(previous => [response.data.collection, ...previous]);

      setForm({
        name: "",
        description: "",
      });

      setShowForm(false);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Unable to create collection.",
      );
    } finally {
      setCreating(false);
    }
  };

  // Delete a collection
  const handleDelete = async collection => {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Delete "${collection.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(collection._id);
    setError("");

    try {
      await api.delete(`/api/collections/${collection._id}`);

      setCollections(previous =>
        previous.filter(item => item._id !== collection._id),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete collection.");
    } finally {
      setDeletingId(null);
    }
  };

  // Authentication loading
  if (authLoading || !isLoggedIn) {
    return <LoadingSpinner message="Checking your account..." />;
  }

  // Collections loading
  if (loading) {
    return <LoadingSpinner message="Loading collections..." />;
  }

  return (
    <main className="container py-4 py-md-5">
      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">My Collections</h1>

          <p className="text-muted mb-0">
            Organize destinations and places into travel ideas.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setShowForm(previous => !previous);
            setFormError("");
          }}
          aria-expanded={showForm}
          disabled={creating}
        >
          <FaPlus />
          {showForm ? "Close Form" : "New Collection"}
        </button>
      </div>

      {/* General errors */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Create collection form */}
      {showForm && (
        <section className="card border rounded-3 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <h2 className="h5 mb-3">Create a Collection</h2>

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label htmlFor="collectionName" className="form-label">
                  Collection Name
                </label>

                <input
                  id="collectionName"
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Summer Vacation"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={80}
                  required
                  disabled={creating}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="collectionDescription" className="form-label">
                  Description (optional)
                </label>

                <textarea
                  id="collectionDescription"
                  name="description"
                  className="form-control"
                  placeholder="What is this collection for?"
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={handleChange}
                  disabled={creating}
                />
              </div>

              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Collection"}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Total collections */}
      <p className="fw-semibold mb-3">
        {collections.length}{" "}
        {collections.length === 1 ? "collection" : "collections"}
      </p>

      {/* Empty state */}
      {collections.length === 0 && !error ? (
        <div className="border rounded-3 p-5 text-center">
          <FaFolderOpen size={36} className="text-secondary mb-3" />

          <h2 className="h5">No collections yet</h2>

          <p className="text-muted mb-0">
            Create a collection to start organizing your travel destinations and
            places.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {collections.map(collection => {
            // Existing airline destinations
            const destinationCodes = collection.destinations || [];

            // Custom places
            const customPlaces = collection.places || [];

            // Convert airline destinations into preview items
            const airlineItems = destinationCodes.map(code => {
              const destination = destinationMap.get(code);

              return {
                id: `airport-${code}`,
                name: destination?.name || code,
                type: "airport",
              };
            });

            // Convert custom places into preview items
            const customItems = customPlaces.map(place => ({
              id: `place-${place._id}`,
              name: place.name,
              type: place.type,
            }));

            // Combine both types
            const allPlaces = [...airlineItems, ...customItems];

            const totalPlaces = allPlaces.length;

            // Show first three places
            const previewPlaces = allPlaces.slice(0, 3);

            // Number of remaining places
            const remainingCount = Math.max(
              totalPlaces - previewPlaces.length,
              0,
            );

            return (
              <div className="col-12 col-md-6 col-lg-4" key={collection._id}>
                <article className="card h-100 shadow-sm rounded-3">
                  <div className="card-body p-3 p-md-4 d-flex flex-column">
                    {/* Collection icon and delete */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <FaFolderOpen className="text-primary" size={28} />

                      <button
                        type="button"
                        className="btn btn-link text-danger p-1"
                        onClick={() => handleDelete(collection)}
                        disabled={Boolean(deletingId)}
                        aria-label={`Delete ${collection.name}`}
                        title="Delete collection"
                      >
                        {deletingId === collection._id ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          />
                        ) : (
                          <FaTrash size={16} />
                        )}
                      </button>
                    </div>

                    {/* Collection name */}
                    <h2 className="h5 mb-2">{collection.name}</h2>

                    {/* Description */}
                    <p className="text-muted small mb-3">
                      {collection.description || "No description provided."}
                    </p>

                    {/* Places preview */}
                    <div className="mb-4">
                      <p className="small text-muted mb-2">
                        {totalPlaces} {totalPlaces === 1 ? "place" : "places"}
                      </p>

                      {previewPlaces.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {previewPlaces.map(place => (
                            <span
                              key={place.id}
                              className="badge rounded-pill text-bg-light border p-2 d-inline-flex align-items-center gap-1"
                            >
                              <FaMapMarkerAlt />

                              <span>{place.name}</span>
                            </span>
                          ))}

                          {remainingCount > 0 && (
                            <span className="badge rounded-pill text-bg-secondary p-2">
                              +{remainingCount} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted small mb-0">
                          No places added yet.
                        </p>
                      )}
                    </div>

                    {/* View collection */}
                    <div className="mt-auto">
                      <Link
                        to={`/collections/${collection._id}`}
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        View Collection
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
