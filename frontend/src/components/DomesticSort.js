import { useLoaderData, useParams } from "react-router-dom";
import axios from "axios";
import ShowDataList from "./ShowDataList";

function DomesticSort() {
  const destinations = useLoaderData();
  const { slug } = useParams();
  console.log(destinations);
  return <div className="container text-center">Hello world</div>;
}

const destinationsLoader = async ({ params }) => {
  const { slug } = params;

  const response = await axios.get(`http://localhost:8080/airlines/${slug}`);

  return response.data;
};

export { DomesticSort as default, destinationsLoader };
