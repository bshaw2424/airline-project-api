const About = () => {
  return (
    <section
      style={{
        backgroundImage: "url(../airlineBackground.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        zIndex: -1,
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          fontSize: "1.2rem",
        }}
        className="container py-5"
      >
        <h1
          style={{
            borderBottom: "1px solid #333",
            fontSize: "3.7rem",
            textAlign: "center",
          }}
          className="pb-2"
        >
          About
        </h1>
        <p className="pt-2">
          Welcome to our comprehensive airline guide, designed to provide
          valuable information on the ten largest airlines in the United States.
          Our mission is to help potential and future passengers discover a wide
          range of travel destinations served by these major airlines. Here’s
          what you can explore on our site:
        </p>
        <ul>
          <li>
            <strong>Discover Destinations:</strong> Find out where your favorite
            airlines fly. Whether you’re planning a domestic trip or an
            international adventure, our platform allows you to explore
            destinations served by the top U.S. airlines.
          </li>
          <li>
            <strong>Search by Airport Code:</strong> Easily search for airlines
            operating at specific airports. Simply enter the airport code to see
            which of the major airlines fly to your chosen location.
          </li>
          <li>
            <strong>Search by State or Country:</strong> Tailor your search
            based on your travel interests. Look up airlines that fly to
            destinations within any U.S. state or explore international
            destinations by country.
          </li>
          <li>
            <strong>Airline-Specific Destinations:</strong> Dive deeper into
            specific airlines to view all the destinations they serve. You can
            filter this data by domestic flights, international routes, and
            seasonal destinations to find the most relevant travel options.
          </li>
        </ul>
        <p>
          <em>
            Please note, while we offer extensive information on destinations,
            we do not provide specific routes between each destination. Our
            primary goal is to serve as a guide, helping you navigate the
            extensive network of top airlines and discover your next travel
            destination with ease.
          </em>
        </p>
        <p>
          Thank you for choosing our site as your go-to resource for airline
          information. Happy travels!
        </p>
      </div>
    </section>
  );
};

export default About;
