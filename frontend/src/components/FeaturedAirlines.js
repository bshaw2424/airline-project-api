import { Link } from "react-router-dom";

const FeaturedAirlines = ({ airlineNames }) => {
  return (
    <section className="mt-1" id="featured">
      <div className=" container pt-3">
        <h1 className=" text-center align-items-center">Featured Airlines</h1>
        <div className="airline-names">
          <div className="text-white px-3">
            {airlineNames.map(airline => (
              <>
                <Link to={`/airlines/${airline.slug}`}>
                  <img
                    style={{
                      height: "80%",
                      width: "80%",
                      objectFit: "contain",
                    }}
                    className="border border-1 rounded p-3 shadow-sm"
                    src={`../${airline.logo}.png`}
                    key={airline.name}
                    alt={airline.name}
                  />
                </Link>
                
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAirlines;
