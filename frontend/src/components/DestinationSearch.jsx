import { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaCheck } from "react-icons/fa";
import api from "../api/axios";

export default function DestinationSearch({
  destinations = [],
  savedCodes = [],
  onSelect,
  disabled = false,
  mode = "collection",
}) {
  const [query, setQuery] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isTripMode = mode === "trip";
  const searchTerm = query.trim().toLowerCase();

  // Search the backend only when used in My Trips
  useEffect(() => {
    if (!isTripMode || disabled || searchTerm.length < 2) {
      setApiResults([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/destinations/search", {
          params: { q: searchTerm },
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setApiResults(response.data);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Destination search failed:", err);
        setError("Unable to search destinations.");
        setApiResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, isTripMode, disabled]);

  // Preserve existing Collections search behavior
  const collectionResults = searchTerm
    ? destinations
        .filter(destination => {
          const searchableFields = [
            destination.name,
            destination.city,
            destination.state,
            destination.airport_name,
            destination.airport_code,
          ];

          return searchableFields.some(field =>
            String(field || "")
              .toLowerCase()
              .includes(searchTerm),
          );
        })
        .slice(0, 10)
    : [];

  const results = isTripMode ? apiResults : collectionResults;

  const handleSelect = destination => {
    onSelect(destination);
    setQuery("");
    setApiResults([]);
  };

  return (
    <div>
      <label htmlFor="destinationSearch" className="form-label fw-semibold">
        {isTripMode ? "Search Existing Airports" : "Search Destinations"}
      </label>

      <div className="input-group">
        <span className="input-group-text">
          <FaSearch />
        </span>

        <input
          id="destinationSearch"
          type="search"
          className="form-control"
          placeholder="Search city, state, airport, or code"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            setApiResults([]);
          }}
          disabled={disabled}
          autoComplete="off"
          maxLength={100}
        />
      </div>

      {isTripMode && loading && (
        <p className="text-muted small mt-2">Searching...</p>
      )}

      {isTripMode && error && (
        <p className="text-danger small mt-2" role="alert">
          {error}
        </p>
      )}

      {searchTerm && (!isTripMode || searchTerm.length >= 2) && (
        <div className="border rounded-3 mt-2 overflow-hidden">
          {results.length === 0 ? (
            <p className="text-muted small p-3 mb-0">
              {isTripMode && loading
                ? "Searching destinations..."
                : "No matching destinations found."}
            </p>
          ) : (
            <ul className="list-group list-group-flush">
              {results.map(destination => {
                const code = destination.airport_code;
                const isSaved = !isTripMode && savedCodes.includes(code);

                return (
                  <li className="list-group-item" key={code}>
                    <div className="d-flex justify-content-between align-items-center gap-3">
                      <div className="flex-grow-1">
                        <div className="fw-semibold">
                          {destination.name || destination.city}
                          {destination.state ? `, ${destination.state}` : ""}
                        </div>

                        <div className="small text-muted">
                          {code} · {destination.airport_name}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm ${
                          isSaved
                            ? "btn-outline-secondary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handleSelect(destination)}
                        disabled={disabled || isSaved}
                        aria-label={
                          isSaved
                            ? `${code} already added`
                            : isTripMode
                              ? `Select ${code} for trip`
                              : `Add ${code} to collection`
                        }
                      >
                        {isSaved ? <FaCheck /> : <FaPlus />}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
