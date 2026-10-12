import axios from "axios";
import { useState } from "react";

const HomeSearch = () => {
  const [search, setSearch] = useState("");
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //    `${process.env.REACT_APP_API}/api/airlines/info`,
  //   ${process.env.REACT_APP_API}/api/airlines/${slug}/destinations

  const handleSearch = async e => {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/airlines/info`,
        // {
        //   params: {
        //     query: search,
        //   },
        // },
      );
      console.log(response);
      setAirlines(response.data);
    } catch (err) {
      setError("No airlines found.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <form onSubmit={handleSearch} className=" btn btn-primary w-100 center">
        <label for="exampleFormControlInput1"></label>
        <input
          type="search"
          className="form-control py-3 mb-4"
          id="exampleFormControlInput1"
          placeholder=" Enter airport code (i.e. LAX or State / Country to see which
              airlines fly there"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div>
          {airlines.map(airline => (
            <div>
              {airline.destinations
                .filter(a => a.city.toLowerCase() === search)
                .map(a => a.name)}
            </div>
          ))}
        </div>
        {/* <div>{search}</div> */}
      </form>{" "}
    </>
  );
};

export default HomeSearch;
