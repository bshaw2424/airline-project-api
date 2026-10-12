export default function SearchForm({
  search,
  setSearch,
  loading,
  onSubmit,
  onClear,
}) {
  return (
    <form
      className="home-search-form border border-1 shadow-sm rounded px-4 py-3"
      onSubmit={onSubmit}
    >
      <label htmlFor="destination-search" className="form-label w-100">
        <h2 className="text-center">
          Search by Airport, Airport Code, State, or Country
        </h2>
      </label>

      <input
        id="destination-search"
        type="search"
        className="form-control my-3"
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Try LAX, California, Mexico, or Los Angeles International"
        disabled={loading}
      />

      <div className="home-search-form__actions">
        <button
          type="submit"
          className="btn btn-primary me-3"
          disabled={loading}
        >
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
