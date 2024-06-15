const FeaturedAirlines = ({ airlineNames }) => {
  return (
    <section
      className="mt-1 text-white"
      id="featured"
      style={{ backgroundColor: "hsla(216, 98%, 54%, 1)" }}
    >
      <div className="d-flex container py-5">
        <h1 className=" text-center d-flex justify-content-center align-items-center">
          Featured Airlines
        </h1>
        <div className="airline-names">
          <div>
            <ul className="m-0 pt-3">
              {airlineNames.map(airline => (
                <li key={airline.name}>{airline.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAirlines;
