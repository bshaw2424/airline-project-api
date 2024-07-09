import DestinationCard from "./DestinationCard";
import Cards from "./Cards";

export default function DisplayFilterList({
  getDestinationsData,
  targetValue,
}) {
  return (
    <section className="container" style={{ minHeight: "48vh" }}>
      <div className="row gy-3 mt-3 mb-4">
        {getDestinationsData.destinations
          .filter(location => location.state === targetValue)
          .map(location => {
            const { airport_code, airport_name, city, state, name, _id } =
              location;
            return (
              <Cards key={`${name}-${_id}`} id={_id}>
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
            );
          })}
      </div>
    </section>
  );
}
