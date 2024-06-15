import AirlineFeature from "./AirlineFeature";

const AirlineFeatureDescription = () => {
  return (
    <section className="w-100" id="feature-description">
      <div className="d-flex justify-content-evenly container py-5">
        <AirlineFeature link="https://www.tsa.gov/travel/security-screening/whatcanibring/all" />
      </div>
    </section>
  );
};

export default AirlineFeatureDescription;
