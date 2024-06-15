import HomeDescription from "./HomeDescription";

const Hero = ({ loading }) => {
  return (
    <section id="hero">
      <HomeDescription loading={loading} />
    </section>
  );
};

export default Hero;
