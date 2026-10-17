import { Link } from "react-router-dom";

export default function TripCard({ trip }) {
  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title">{trip.name}</h3>

        <p className="text-muted mb-2">Destination: {trip.destinationCode}</p>

        {trip.startDate && (
          <p className="mb-1">
            <strong>Start:</strong> {trip.startDate.slice(0, 10)}
          </p>
        )}

        {trip.endDate && (
          <p className="mb-1">
            <strong>End:</strong> {trip.endDate.slice(0, 10)}
          </p>
        )}

        {trip.notes && <p className="card-text mt-3 mb-0">{trip.notes}</p>}

        <div className="mt-auto pt-3">
          <Link
            to={`/my-trips/${trip._id}`}
            className="btn btn-outline-primary btn-sm"
          >
            View Trip
          </Link>
        </div>
      </div>
    </article>
  );
}
