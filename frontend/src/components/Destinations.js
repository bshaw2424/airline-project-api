import { useLoaderData, useParams } from "react-router-dom";
import axios from "axios";
import AirlineDisplayContainer from "./AirlineDisplayContainer";

function Destinations() {
  const { slug } = useParams();
  const destinations = useLoaderData();
  return (
    <>
      <AirlineDisplayContainer
        destinations={destinations}
        stateDestinations={destinations}
      />
    </>
  );
}

const destinationsLoader = async ({ params }) => {
  const { slug } = params;

  const response = await axios.get(`http://localhost:8080/airlines/${slug}`);

  return response.data;
};

export { Destinations as default, destinationsLoader };
