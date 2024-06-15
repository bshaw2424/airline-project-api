import React, { useEffect } from "react";
import DisclaimerMessage from "./DisclaimerMessage";
import StateList from "./StateList";

export default function InternationalSearch({
  airlineSearch,
  targetCategoryValue,
  airlineName,
  internationalSearchValue,
  isScrolled,
}) {
  useEffect(() => {
    if (isScrolled) {
      const element = document.getElementById("stateDestinationMap");

      if (element) {
        element.scrollIntoView({
          alignToTop: true,
          behavior: "smooth",
        });
      }
    }
  }, [isScrolled]);

  const getListOfInternationalDestinations = airlineSearch
    .map(internationalDestination => ({
      name: internationalDestination.name,
      codes: internationalDestination.destinations
        .filter(location => location.state === targetCategoryValue)
        .map(location => location.airport_code),
    }))
    .filter(listItem => listItem.codes.length !== 0)
    .reduce((acc, a) => {
      acc[a.name] = false;
      return acc;
    }, {});

  return (
    <article className="mt-5">
      <div id="stateDestinationMap">
        <div className="d-flex justify-content-evenly">
          <StateList
            dataList={airlineSearch}
            searchValue={targetCategoryValue}
            objectState={getListOfInternationalDestinations(airlineSearch)}
            internationalSearchValue={internationalSearchValue}
          />
        </div>
      </div>
      <div className="text-center pt-4">
        <h2 style={{ fontSize: "2.4rem" }}>
          {airlineName}
          <DisclaimerMessage />
        </h2>
      </div>
    </article>
  );
}
