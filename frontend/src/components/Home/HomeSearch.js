import { useState } from "react";
import api from "../../api/axios";

const HomeSearch = () => {
  const [search, setSearch] = useState("");
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async e => {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/airlines/info");

      setAirlines(response.data);
    } catch (err) {
      console.error("Unable to load airlines:", err);
      setError("Unable to load airlines.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-100">
      <label htmlFor="exampleFormControlInput1" className="visually-hidden">
        Search destinations
      </label>

      <input
        type="search"
        className="form-control py-3 mb-4"
        id="exampleFormControlInput1"
        placeholder="Enter an airport code, state, or country"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="text-danger mt-3">{error}</p>}

      <div className="mt-3">
        {airlines.flatMap(airline =>
          airline.destinations
            .filter(destination =>
              destination.city
                ?.toLowerCase()
                .includes(search.trim().toLowerCase()),
            )
            .map(destination => (
              <div key={`${airline._id}-${destination.airport_code}`}>
                {destination.name}
              </div>
            )),
        )}
      </div>
    </form>
  );
};

export default HomeSearch;
