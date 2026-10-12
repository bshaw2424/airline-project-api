import { useLoaderData, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const AirlinePage = () => {
  const { slug } = useParams();
  const airlines = useLoaderData();

  return (
    <section className="container">
      <Header airlines={airlines} slug={slug} />
    </section>
  );
};

const destinationsLoader = async ({ params }) => {
  const { slug } = params;

  const response = await axios.get(
    `https://whale-app-v8vd4.ondigitalocean.app/api/airlines/${slug}/destinations`,
  );

  return response.data;
};

export default AirlinePage;
export { destinationsLoader };
