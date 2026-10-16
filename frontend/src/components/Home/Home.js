import FeaturedAirlines from "../FeaturedAirlines";
import AirlineFeatureDescription from "../AirlineFeatureDescription";
// import api from "../../api/axios"; // Adjust the import path

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

// export const destinationIndexLoader = async () => {
//   const response = await axios.get(
//     `${process.env.REACT_APP_API}/api/airlines/info`,
//   );

//   return response.data;
// };

export const destinationIndexLoader = async () => {
  try {
    console.log("TESTING DIRECT AXIOS REQUEST");

    const response = await axios.get(
      "http://localhost:8000/api/airlines/info",
      {
        withCredentials: false,
      },
    );

    console.log("AXIOS STATUS:", response.status);
    console.log("AIRLINES RECEIVED:", response.data.length);

    return response.data;
  } catch (error) {
    console.error("DIRECT AXIOS ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      code: error.code,
      message: error.message,
    });

    throw error;
  }
};
