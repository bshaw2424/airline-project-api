import DestinationCard from "./DestinationCard";
import Cards from "./Cards";

export default function MainDestinationList({ destinations }) {
  return (
    <>
      <div className="row gy-3 my-3">
        {destinations.destinations.map(location => {
          const { _id, airport_code, airport_name, city, state, name } =
            location;
          return (
            <Cards id={_id}>
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
    </>
  );
}
