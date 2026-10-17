import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateTrip from "./CreateTrip";
import TripCard from "./TripCard";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleTripCreated = newTrip => {
    setTrips(prev => [newTrip, ...prev]);
    setShowCreateForm(false);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrips = async () => {
      try {
        const response = await api.get("/api/trips", {
          signal: controller.signal,
        });

        setTrips(response.data.trips);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Unable to fetch trips:", error);
        setError("Unable to load your trips. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTrips();

    return () => controller.abort();
  }, []);

  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold">My Trips</h1>
          <p className="text-muted mb-0">
            Plan and organize your upcoming adventures.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowCreateForm(prev => !prev)}
          aria-expanded={showCreateForm}
        >
          {showCreateForm ? "Cancel" : "+ Create Trip"}
        </button>
      </div>

      {loading && <p>Loading your trips...</p>}

      {showCreateForm && (
        <section className="border rounded-3 p-4 mb-4">
          <h2 className="h5 mb-3">Create a New Trip</h2>
          <CreateTrip onTripCreated={handleTripCreated} />
        </section>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <section className="border rounded-3 p-4">
          <h2 className="h5 mb-3">Your Trips ({trips.length})</h2>

          {trips.length === 0 ? (
            <p className="text-muted mb-0">No trips created yet.</p>
          ) : (
            <div className="row g-3">
              {trips.map(trip => (
                <div key={trip._id} className="col-12 col-md-6 col-xl-4">
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
