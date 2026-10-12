// import HomeSearch from "./HomeSearch";
import HomeSearch from '../Search/HomeSearch';

const HomeDescription = () => {
  return (
    <section
      style={{
        height: "100vh",
        marginTop: ".5rem",
        marginBottom: "1rem",
      }}
      id="home-description-container"
    >
      <div style={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            height: "100%",
          }}
    
        >
          <p
            style={{
              fontSize: "3rem",
              color: "#333",
              paddingLeft: "1.5rem",
              textTransform: "capitalize",
              flex: 2,
            }}
            className="d-flex justify-content-center align-items-center"
          >
            Finding your next favorite travel destination
            <span className="text-primary">Awaits</span>
            <h5 className="mt-3">
              Explore which airlines fly to your favorite airport and discover
              all the destinations you can reach
            </h5>
          </p>

  
        </div>
      </div>
    </section>
  );
};

export default HomeDescription;
