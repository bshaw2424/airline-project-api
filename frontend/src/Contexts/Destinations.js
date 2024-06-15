import { useLoaderData, useParams } from "react-router-dom";
import axios from "axios";
import { createContext } from "react";

const DestinationsContext = createContext();

export function DestinationsProvider({ children }) {
  const { slug } = useParams();
  const destinations = useLoaderData();

  return (
    <DestinationsContext.Provider value={destinations}>
      {children}
    </DestinationsContext.Provider>
  );
}
export default DestinationsContext;

export const destinationsLoader = async ({ params }) => {
  const { slug } = params;

  const response = await axios.get(`http://localhost:8080/airlines/${slug}`);

  return response.data;
};
