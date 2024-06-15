export default function AirlineNumbers({ airlines }) {
  return (
    <div className="row my-5">
      <div className="col-xs-6 col-sm-6 mb-4 dropdown">
        <button
          className="btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Airlines/Destinations
        </button>
        <ul className="dropdown-menu p-3">
          {airlines.map(airline => (
            <a href={`/airlines/${airline.slug}`} alt={`${airline.name}`}>
              <li>
                <b>{airline.name}</b> - {airline.destinations.length}
              </li>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
}
