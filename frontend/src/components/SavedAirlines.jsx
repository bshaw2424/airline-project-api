import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function SavedAirlines() {
  const navigate = useNavigate();
  const airlines = useLoaderData();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [savedSlugs, setSavedSlugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingSlug, setRemovingSlug] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const fetchSavedAirlines = async () => {
      try {
        const response = await api.get("/api/favorites/airlines");

        if (active) {
          setSavedSlugs(response.data.savedAirlines || []);
        }
      } catch (error) {
        if (active) {
          setError("Unable to load saved airlines.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSavedAirlines();

    return () => {
      active = false;
    };
  }, [isLoggedIn, authLoading, navigate]);

  // Match saved slugs with airline records
  const savedAirlines = Array.isArray(airlines)
    ? airlines.filter(airline => savedSlugs.includes(airline.slug))
    : [];

  const handleRemove = async airlineSlug => {
    if (removingSlug) return;

    setRemovingSlug(airlineSlug);
    setError("");

    try {
      const response = await api.delete(
        `/api/favorites/airlines/${airlineSlug}`,
      );

      setSavedSlugs(response.data.savedAirlines || []);
    } catch (error) {
      setError("Unable to remove saved airline.");
    } finally {
      setRemovingSlug(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="container py-5">
        <p>Loading saved airlines...</p>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1>Saved Airlines</h1>
        <p className="text-muted">
          Keep your favorite airlines together and explore where they fly.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {savedAirlines.length === 0 && !error ? (
        <div className="border rounded-3 p-4 text-center">
          <FaHeart className="text-secondary mb-3" size={28} />

          <h2 className="h5">No saved airlines yet</h2>

          <p className="text-muted">
            Explore airlines and save your favorites using the heart icon.
          </p>

          <Link to="/airlines" className="btn btn-primary">
            Explore Airlines
          </Link>
        </div>
      ) : (
        <>
          <p className="fw-semibold mb-3">
            {savedAirlines.length}{" "}
            {savedAirlines.length === 1 ? "airline saved" : "airlines saved"}
          </p>

          <div className="row g-3">
            {savedAirlines.map(airline => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={airline._id || airline.slug}
              >
                <article className="card h-100 shadow-sm border-1 rounded-3">
                  <div className="card-body d-flex flex-column">
                    {/* Airline logo and remove button */}
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <Link to={`/airlines/${airline.slug}`}>
                        <img
                          src={`/${airline.logo}.png`}
                          alt={airline.name}
                          className="img-fluid"
                          style={{
                            maxWidth: "130px",
                            height: "65px",
                            objectFit: "contain",
                          }}
                        />
                      </Link>

                      <button
                        type="button"
                        className="btn btn-link border-0 p-2"
                        onClick={() => handleRemove(airline.slug)}
                        disabled={Boolean(removingSlug)}
                        aria-label={`Remove ${airline.name} from saved airlines`}
                        title="Remove saved airline"
                      >
                        <FaHeart className="text-danger" size={20} />
                      </button>
                    </div>

                    {/* Airline information */}
                    <div className="mt-3">
                      <h2 className="h5 mb-2">{airline.name}</h2>

                      <p className="text-muted small mb-0">
                        <strong>{airline.destinations?.length || 0}</strong>{" "}
                        destinations
                      </p>
                    </div>

                    {/* Airline detail link */}
                    <div className="mt-auto pt-4">
                      <Link
                        to={`/airlines/${airline.slug}`}
                        className="btn btn-outline-primary w-100"
                      >
                        Explore Destinations
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
