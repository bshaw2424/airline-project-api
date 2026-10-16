import api from "../../api/axios";
import { useEffect, useMemo, useState } from "react";

import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import AirlineDrawer from "./AirlineDrawer";

import {
  findMatches,
  flattenAirlineDestinations,
  groupMatchesByAirline,
} from "./SearchHelpers";

export default function HomeSearch() {
  const [allAirlines, setAllAirlines] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/airlines/info");

        const airlineData = Array.isArray(response.data)
          ? response.data
          : (response.data.airlines ?? []);

        setAllAirlines(airlineData);
      } catch (err) {
        console.error("Unable to load airlines:", err);
        setError("Unable to load airline data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAirlines();
  }, []);

  const searchableDestinations = useMemo(() => {
    return flattenAirlineDestinations(allAirlines);
  }, [allAirlines]);

  const handleSearch = event => {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      setError("Enter an airport code, airport name, city, state, or country.");
      setResults([]);
      setSearchInfo(null);
      setSelectedAirline(null);
      return;
    }

    setError("");
    setSelectedAirline(null);

    const searchMatch = findMatches(searchableDestinations, query);

    if (!searchMatch) {
      setResults([]);
      setSearchInfo(null);
      setError(`No results found for "${query}".`);
      return;
    }

    const groupedResults = groupMatchesByAirline(searchMatch.matches);

    setResults(groupedResults);

    setSearchInfo({
      type: searchMatch.type,
      query,
      airlineCount: groupedResults.length,
    });
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
    setSearchInfo(null);
    setSelectedAirline(null);
    setError("");
  };

  return (
    <section className="home-search">
      <SearchForm
        search={search}
        setSearch={setSearch}
        loading={loading}
        onSubmit={handleSearch}
        onClear={handleClear}
      />

      {error && <p className="home-search__error text-center mt-3">{error}</p>}

      <article className="d-flex">
        <SearchResults
          results={results}
          searchInfo={searchInfo}
          onSelectAirline={setSelectedAirline}
        />

        <AirlineDrawer
          airline={selectedAirline}
          onClose={() => setSelectedAirline(null)}
        />
      </article>
    </section>
  );
}
