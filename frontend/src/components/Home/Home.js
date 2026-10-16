import { useLoaderData, useNavigation } from "react-router-dom";
import api from "../../api/axios";

import FeaturedAirlines from "../FeaturedAirlines";
import AirlineFeatureDescription from "../AirlineFeatureDescription";
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
  try {
    const response = await api.get("/api/airlines/info");

    return response.data;
  } catch (error) {
    console.error("Unable to load airlines:", error);
    throw error;
  }
};
