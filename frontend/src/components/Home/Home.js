import FeaturedAirlines from "../FeaturedAirlines";
import AirlineFeatureDescription from "../AirlineFeatureDescription";
import { useLoaderData, useNavigation } from "react-router-dom";
import axios from "axios";
import Hero from "./Hero";
import { useEffect, useState } from "react";
import Loader from "../Loader";

export default function Home() {
  const getAirlineNames = useLoaderData();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  // get navigation state to add loader icon
  useEffect(() => {
    setIsLoading(navigation.state === "loading");
  }, [navigation.state]);

  return (
    <main>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <>
          <Hero loading={setIsLoading} />
          <FeaturedAirlines airlineNames={getAirlineNames} />
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
