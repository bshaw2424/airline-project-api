import HomeDescription from "./HomeDescription";
import HomeSearch from "../Search/HomeSearch"

const Hero = () => {
  return (
    <section id="hero" className="container">
      <HomeDescription />
      <HomeSearch />
    </section>
  );
};

export default Hero;
