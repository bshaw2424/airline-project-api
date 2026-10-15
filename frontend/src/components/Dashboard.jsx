import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaPlane,
  FaHeart,
  FaFolderOpen,
  FaArrowRight,
  FaPlus,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import LoadingSpinner from "./LoadingSpinner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [savedAirlines, setSavedAirlines] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [airlinesResponse, destinationsResponse, collectionsResponse] =
          await Promise.all([
            api.get("/api/favorites/airlines"),
            api.get("/api/favorites/destinations"),
            api.get("/api/collections"),
          ]);

        if (!active) return;

        setSavedAirlines(airlinesResponse.data.savedAirlines || []);

        setSavedDestinations(destinationsResponse.data.savedDestinations || []);

        setCollections(collectionsResponse.data.collections || []);
      } catch (err) {
        if (active) {
          setError("Unable to load your dashboard. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      active = false;
    };
  }, [authLoading, isLoggedIn, navigate]);

  // Favorite counts remain independent of collections
  const airlineCount = new Set(savedAirlines).size;
  const destinationCount = new Set(savedDestinations).size;

  // Number of collections, not number of places
  const collectionCount = collections.length;

  // Show the three most recently created collections
  const recentCollections = [...collections]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  if (authLoading || !isLoggedIn) {
    return <LoadingSpinner message="Checking your account..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <main className="container py-4 py-md-5">
      {/* Dashboard header */}
      <header className="mb-4">
        <h1 className="h3 mb-2">
          Welcome back
          {user?.username ? `, ${user.username}` : ""}!
        </h1>

        <p className="text-muted mb-0">
          Your saved airlines, destinations, and travel collections in one
          place.
        </p>
      </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Dashboard summary cards */}
      <section className="mb-5" aria-label="Your travel overview">
        <div className="row g-3">
          {/* Saved Airlines */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm rounded-3">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <FaPlane className="text-primary" size={26} />

                  <span className="text-muted small">Saved Airlines</span>
                </div>

                <h2 className="display-6 fw-bold">{airlineCount}</h2>

                <p className="text-muted small">
                  Airlines you've saved for future reference.
                </p>

                <Link
                  to="/saved-airlines"
                  className="btn btn-outline-primary mt-auto d-flex justify-content-center align-items-center gap-2"
                >
                  View Airlines
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Saved Destinations */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm rounded-3">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <FaHeart className="text-danger" size={26} />

                  <span className="text-muted small">Saved Destinations</span>
                </div>

                <h2 className="display-6 fw-bold">{destinationCount}</h2>

                <p className="text-muted small">
                  Places you've marked as favorites.
                </p>

                <Link
                  to="/saved-destinations"
                  className="btn btn-outline-primary mt-auto d-flex justify-content-center align-items-center gap-2"
                >
                  View Destinations
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* My Collections */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm rounded-3">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <FaFolderOpen className="text-primary" size={26} />

                  <span className="text-muted small">My Collections</span>
                </div>

                <h2 className="display-6 fw-bold">{collectionCount}</h2>

                <p className="text-muted small">
                  Collections you've created to organize trips.
                </p>

                <Link
                  to="/collections"
                  className="btn btn-outline-primary mt-auto d-flex justify-content-center align-items-center gap-2"
                >
                  View Collections
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Collections */}
      <section className="mb-5">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <h2 className="h5 mb-0">Recent Collections</h2>

          <Link
            to="/collections"
            className="text-decoration-none d-inline-flex align-items-center gap-2"
          >
            View All
            <FaArrowRight size={13} />
          </Link>
        </div>

        {recentCollections.length === 0 ? (
          <div className="border rounded-3 p-4 text-center">
            <FaFolderOpen size={30} className="text-secondary mb-3" />

            <h3 className="h6">No collections yet</h3>

            <p className="text-muted mb-3">
              Create your first collection to organize places you'd like to
              visit.
            </p>

            <Link
              to="/collections"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
            >
              <FaPlus />
              Create a Collection
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {recentCollections.map(collection => {
              // Airline destinations stored as airport codes
              const destinationCodes = collection.destinations || [];

              // Manually added places
              const customPlaces = collection.places || [];

              // Build preview items
              const airlineItems = destinationCodes.map(code => ({
                id: `airport-${code}`,
                name: code,
              }));

              const customItems = customPlaces.map(place => ({
                id: `place-${place._id}`,
                name: place.name,
              }));

              const allPlaces = [...airlineItems, ...customItems];

              const totalPlaces = allPlaces.length;
              const previewPlaces = allPlaces.slice(0, 3);

              const remainingCount = Math.max(
                totalPlaces - previewPlaces.length,
                0,
              );

              return (
                <div className="col-12 col-md-6 col-lg-4" key={collection._id}>
                  <article className="card h-100 shadow-sm rounded-3">
                    <div className="card-body p-3 p-md-4 d-flex flex-column">
                      <FaFolderOpen className="text-primary mb-3" size={24} />

                      <h3 className="h5">{collection.name}</h3>

                      <p className="text-muted small mb-3">
                        {collection.description ||
                          "Your saved travel destinations."}
                      </p>

                      {/* Total places */}
                      <p className="small text-muted mb-2">
                        {totalPlaces} {totalPlaces === 1 ? "place" : "places"}
                      </p>

                      {/* Place preview */}
                      <div className="mb-4">
                        {previewPlaces.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {previewPlaces.map(place => (
                              <span
                                key={place.id}
                                className="badge rounded-pill text-bg-light border p-2 d-inline-flex align-items-center gap-1"
                              >
                                <FaMapMarkerAlt />
                                {place.name}
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

                      <Link
                        to={`/collections/${collection._id}`}
                        className="btn btn-outline-primary mt-auto d-flex align-items-center justify-content-center gap-2"
                      >
                        Open Collection
                        <FaArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Explore destinations */}
      <section className="border rounded-3 p-4 text-center">
        <FaPlane className="text-primary mb-3" size={28} />

        <h2 className="h5">Discover Somewhere New</h2>

        <p className="text-muted">
          Explore airline destinations and save places that interest you.
        </p>

        <Link to="/" className="btn btn-primary">
          Explore Destinations
        </Link>
      </section>
    </main>
  );
}
