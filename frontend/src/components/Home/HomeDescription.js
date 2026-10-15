const HomeDescription = () => {
  return (
    <section id="home-description-container" className="py-4 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8 w-100">
            <div className="text-center">
              <h1
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(3rem, 5vw, 3.5rem)",
                  lineHeight: 1.2,
                }}
              >
                Your next favorite destination awaits.
              </h1>

              <p className="lead text-muted mb-0">
                Discover where airlines fly, explore destinations, and save
                places for your next adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDescription;
