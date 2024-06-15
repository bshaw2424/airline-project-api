import DestinationCard from "./DestinationCard";
import Cards from "./Cards";

export default function ShowDataList({ destinations, dataCategory, value }) {
  const sortedDestinations = [...destinations.destinations].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return (
    <section className="row gy-3 mt-3 mb-2">
      <div>
        {sortedDestinations.map((location, id) => {
          const { _id, name, airport_code, airport_name, city, state } =
            location;

          return (
            location[dataCategory] === value && (
              <Cards id={_id} key={`${name}-${id}`}>
                <DestinationCard
                  _id={_id}
                  airport_code={airport_code}
                  airport_name={airport_name}
                  city={city}
                  state={state}
                  name={name}
                  location={location}
                />
              </Cards>
            )
          );
        })}
      </div>
    </section>
  );
}
