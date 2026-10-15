export default function SearchResults({
  results,
  searchInfo,
  onSelectAirline,
}) {
  if (!searchInfo || results.length === 0) {
    return null;
  }

  return (
    <section className="search-results container py-4">
      <header className="text-center mb-4">
        <h2 className="fs-3 fw-semibold">
          {searchInfo.airlineCount}{" "}
          {searchInfo.airlineCount === 1 ? "airline found" : "airlines found"}
        </h2>

        <p className="text-muted mb-0">
          <strong>{searchInfo.query.toUpperCase()}</strong>
          {" · "} matched by {searchInfo.type}
        </p>
      </header>

      <ul className="row g-3 list-unstyled m-0">
        {results.map(airline => (
          <li key={airline.id} className="col-12 col-sm-6 col-lg-4">
            <button
              type="button"
              className="search-results__button w-100 h-100 bg-white border rounded-3 shadow-sm p-4 d-flex flex-column align-items-center justify-content-between gap-3"
              onClick={() => onSelectAirline(airline)}
            >
              <div className="d-flex align-items-center justify-content-center w-100">
                {airline.logo && (
                  <img
                    src={`../${airline.logo}.png`}
                    alt={airline.name}
                    className="img-fluid search-results__logo"
                  />
                )}
              </div>

              <div className="text-center">
                <p className="fw-semibold mb-1">{airline.name}</p>

                <span className="text-muted small">
                  {airline.matchingAirportCount}{" "}
                  {airline.matchingAirportCount === 1
                    ? "matching airport"
                    : "matching airports"}
                </span>

                <div className="mt-2">
                  <span className="small text-primary">
                    View destinations →
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
