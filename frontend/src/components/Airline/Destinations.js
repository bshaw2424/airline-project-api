import { MdOutlineLocalAirport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

const Destinations = ({ destinations = [] }) => {
  return (
    <article className="my-3">
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Code</th>
              <th>
                <MdOutlineLocalAirport className="me-2" />
                Airport
              </th>
              <th>
                <FaLocationDot className="me-2" />
                Location
              </th>
            </tr>
          </thead>

          <tbody>
            {destinations.map(destination => (
              <tr key={destination._id || destination.airport_code}>
                <td>{destination.name}</td>

                <td>
                  <strong>{destination.airport_code}</strong>
                </td>

                <td>{destination.airport_name}</td>

                <td>
                  {destination.city}, {destination.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default Destinations;
