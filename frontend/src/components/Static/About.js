const About = () => {
  return (
    <section className="about-page container my-4">
      <header className="about-hero my-3">
        <h1 className="text-center mb-3  ">About FlightInRange</h1>
        <h2>Helping Travelers Discover, Plan, and Travel with Confidence</h2>

        <p>
          FlightInRange is a travel discovery and planning platform designed to
          help travelers explore destinations, compare airlines, understand
          travel requirements, and prepare for their next adventure — all before
          booking a flight.
        </p>
      </header>

      <section className="about-section">
        <h2>Why FlightInRange Exists</h2>

        <p>
          Travel planning should be about more than simply booking a flight.
          Before you ever purchase a ticket, there are countless questions to
          answer:
        </p>

        <ul>
          <li>Which airlines fly to my destination?</li>
          <li>What airports serve the area I want to visit?</li>
          <li>What travel requirements should I know about?</li>
          <li>What baggage fees can I expect?</li>
          <li>What can I bring through TSA?</li>
          <li>Which destination best fits my travel goals?</li>
        </ul>

        <p>
          FlightInRange was created to answer those questions and help travelers
          make informed decisions before they book.
        </p>
      </section>

      <section className="about-section">
        <h2>What You Can Do</h2>

        <article>
          <h3>Explore by Airline</h3>
          <p>
            Discover destinations served by major U.S. airlines. Browse
            domestic, international, and seasonal destinations to better
            understand where each airline can take you.
          </p>
        </article>

        <article>
          <h3>Search by Airport</h3>
          <p>
            Search using an airport code to instantly see which airlines operate
            there and explore the destinations they serve.
          </p>
        </article>

        <article>
          <h3>Search by State or Country</h3>
          <p>
            Planning a trip to a specific state or country? Explore the airlines
            serving that region, discover airports, and find destinations that
            match your travel interests.
          </p>
        </article>

        <article>
          <h3>Travel Preparation</h3>
          <p>
            FlightInRange is expanding beyond destination discovery by providing
            practical travel information such as TSA guidance, baggage policies,
            airport information, international travel requirements, and helpful
            travel tips.
          </p>
        </article>

        <article>
          <h3>AI Travel Assistant Coming Soon</h3>
          <p>
            Our upcoming AI-powered travel assistant will help travelers prepare
            for trips by answering destination-specific questions, providing
            personalized guidance, packing recommendations, and travel insights
            before departure.
          </p>
        </article>
      </section>

      <section className="about-section">
        <h2>Our Vision</h2>

        <p>
          FlightInRange is more than an airline destination database. We are
          building a travel discovery and planning platform that combines
          airline information, destination exploration, travel preparation, and
          personalized guidance into one place.
        </p>

        <p>
          Whether you're deciding where to travel next or making sure you're
          fully prepared before leaving home, FlightInRange is designed to help
          you discover, prepare, and travel with confidence.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Promise</h2>

        <p>
          We do not sell flights, and we are not trying to replace booking
          websites. Instead, our goal is to help you make informed travel
          decisions before you book.
        </p>

        <p>
          As FlightInRange grows, you will be able to save your favorite
          destinations, organize travel boards, compare airline experiences,
          receive personalized AI travel assistance, and discover inspiring
          places around the world — all in one place.
        </p>

        <p>
          Thank you for making FlightInRange part of your travel planning
          journey. We hope it inspires your next destination and helps you
          travel smarter every step of the way.
        </p>
      </section>
    </section>
  );
};

export default About;
