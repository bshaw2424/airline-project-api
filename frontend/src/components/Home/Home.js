import FeaturedAirlines from "../FeaturedAirlines";
import AirlineFeatureDescription from "../AirlineFeatureDescription";

import { useLoaderData, useNavigation } from "react-router-dom";
import axios from "axios";

import Hero from "./Hero";
import Loader from "../Loader";

export default function Home() {
  const airlineNames = useLoaderData();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <main>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <>
          <Hero />
          <FeaturedAirlines airlineNames={airlineNames} />
          <AirlineFeatureDescription />
        </>
      )}
    </main>
  );
}

export const destinationIndexLoader = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API}/api/airlines/info`,
  );

  return response.data;
};
