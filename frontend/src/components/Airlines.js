import { useLoaderData } from "react-router-dom";

import AirlineListDataLinks from "./AirlineListDataLinks";
import axios from "axios";

export default function Airlines({ targetInput, showIconForAirportCode }) {
  // using a loader to fetch the data
  const airlineData = useLoaderData();

  const getAirlineListItemBasedOnActiveStatusToShowIcon = () => {
    const objectListAirlineNameAndLength = [];
    const activeList = [];

    for (const airline of airlineData) {
      const destinationsLength = airline.destinations.filter(
        destination => destination.airport_code === targetInput,
      ).length;

      objectListAirlineNameAndLength.push({
        name: airline.name,
        length: destinationsLength,
      });
      activeList.push({ name: airline.name, active: false });
    }

    const filteredList = objectListAirlineNameAndLength
      .filter(a => a.length > 0)
      .map(a => a.name);

    const getListOfAirportCodeDestinations = activeList.map(destination => {
      if (filteredList.includes(destination.name)) {
        return { ...destination, active: !destination.active };
      }
      return destination;
    });

    const showListItemsThatMatchAirportCode =
      getListOfAirportCodeDestinations.map(a => a.active);

    return showListItemsThatMatchAirportCode;
  };

  return (
    <div className="mt-2">
      <AirlineListDataLinks
        airlineNameData={airlineData}
        icons={
          showIconForAirportCode === "airport_code"
            ? getAirlineListItemBasedOnActiveStatusToShowIcon()
            : ""
        }
      />
    </div>
  );
}

export const destinationIndexLoader = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API}/api/airlines/info`,
  );

  return response.data;
};
