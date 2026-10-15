import { useState } from "react";
import { FaSearch, FaPlus, FaCheck } from "react-icons/fa";

export default function DestinationSearch({
  destinations = [],
  savedCodes = [],
  onSelect,
  disabled = false,
}) {
  const [query, setQuery] = useState("");

  const searchTerm = query.trim().toLowerCase();

  const results = searchTerm
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

  const handleSelect = destination => {
    onSelect(destination);
    setQuery("");
  };

  return (
    <div>
      <label htmlFor="destinationSearch" className="form-label fw-semibold">
        Search Destinations
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
          onChange={event => setQuery(event.target.value)}
          disabled={disabled}
          autoComplete="off"
        />
      </div>

      {searchTerm && (
        <div className="border rounded-3 mt-2 overflow-hidden">
          {results.length === 0 ? (
            <p className="text-muted small p-3 mb-0">
              No matching destinations found.
            </p>
          ) : (
            <ul className="list-group list-group-flush">
              {results.map(destination => {
                const code = destination.airport_code;
                const isSaved = savedCodes.includes(code);

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
