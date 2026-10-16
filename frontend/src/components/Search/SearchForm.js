export default function SearchForm({
  search,
  setSearch,
  loading,
  onSubmit,
  onClear,
}) {
  return (
    <form
      className="home-search-form border shadow-sm rounded-3 p-3 p-md-4"
      onSubmit={onSubmit}
    >
      <h2 className="fs-4 fw-semibold text-center mb-3">
        Search by Airport, Airport Code, State, or Country
      </h2>

      <label htmlFor="destination-search" className="form-label">
        Enter a destination
      </label>

      <input
        id="destination-search"
        type="search"
        className="form-control mb-3"
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Try LAX, California, Mexico, or Los Angeles International"
        disabled={loading}
      />

      <div className="home-search-form__actions d-flex flex-column flex-sm-row gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>

        {search && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
