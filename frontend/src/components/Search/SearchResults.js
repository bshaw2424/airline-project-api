export default function SearchResults({
  results,
  searchInfo,
  onSelectAirline,
}) {
  if (!searchInfo || results.length === 0) {
    return null;
  }

  return (
    <section className="search-results rounded-3 shadow-sm w-100">
      <header className="search-results__header w-100 p-3 text-center">
        <h2>
          {searchInfo.airlineCount}{" "}
          {searchInfo.airlineCount === 1 ? "airline found" : "airlines found"}
        </h2>

        <p>
          <strong>{searchInfo.query.toUpperCase()}</strong>
          {" · "}
          matched by {searchInfo.type}
        </p>
      </header>

      <ul className="search-results__list p-0 d-flex flex-column align-items-center justify-content-center">
        {results.map(airline => (
          <li
            key={airline.id}
            className="search-results__item  d-flex align-items-center shadow-sm justify-content-center w-50 border border-1 rounded-3 my-4"
          >
            <button
              type="button"
              className="search-results__button bg-white border-0 w-100"
              onClick={() => onSelectAirline(airline)}
            >
              <div className="search-results__airline">
                <div className=" mt-3">
                  {airline.logo && (
                    <img
                      style={{
                        objectFit: "contain",
                        height: "300px",
                        width: "300px",
                      }}
                      src={`../${airline.logo}.png`}
                      alt={airline.name}
                      className="search-results__logo img_fluid img-thumbnail rounded-4 p-3 border-0"
                    />
                  )}

                  <p className="width-100 p-0 mb-3">
                    {airline.matchingAirportCount}{" "}
                    {airline.matchingAirportCount === 1
                      ? "matching airport"
                      : "matching airports"}
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
