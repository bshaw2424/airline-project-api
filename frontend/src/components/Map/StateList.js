import React, { useState, useEffect } from "react";
import DisplayMarkers from "./DisplayMarkers";
import { axiosCallToLatitudeAndLongitudeCoordinates } from "../AirportAxiosQuery";
import {
  getUniqueListOfAirportCodes,
  changeAirportCodeToIcaoCode,
} from "../../Utilities";
import StateMap from "./StateMap";
import AirlineMapList from "./AirlineMapList";

export default function StateList({
  dataList,
  searchValue,
  objectState,
  internationalSearchValue,
}) {
  const getAirportCodes = dataList.flatMap(a =>
    a.destinations
      .filter(item => item.state === searchValue)
      .map(item => ({
        airport: item.airport_name,
        code: item.airport_code,
      })),
  );
  const filteredCodes = getAirportCodes.filter(item => item.code);

  const getListOfAirlinesObject = () =>
    dataList
      .map(state => {
        const codes = state.destinations
          .filter(location => location.state === searchValue)
          .map(items => ({
            code:
              internationalSearchValue === "false"
                ? changeAirportCodeToIcaoCode(items.airport_code)
                : items.airport_code,
            airport: items.airport_name,
          }));

        return {
          name: state.name,
          codes: codes,
          airport_details: filteredCodes,
          length: codes.length, // Set the length to the length of the codes array
        };
      })
      .filter(listItem => listItem.codes.length !== 0);

  const [getActiveState, setActiveState] = useState(objectState);
  const [coords, setCoords] = useState();
  const [airlineNameList, setAirlineNameList] = useState();
  const [airlineObjectData, setAirlineObjectData] = useState(
    getListOfAirlinesObject(),
  );
  const [airlineIndex, setAirlineIndex] = useState();

  useEffect(() => {
    axiosCallToLatitudeAndLongitudeCoordinates(
      internationalSearchValue === "false" ? "icao" : "iata",
      searchValue,
    );
  }, [searchValue, internationalSearchValue]);

  const handleStateClick = airlineName => {
    setActiveState(prevState => ({
      ...Object.fromEntries(
        Object.entries(prevState).map(([key]) => [key, false]),
      ),
      [airlineName]: true,
    }));
    if (airlineNameList) {
      setAirlineIndex(getCoordinatesAndTitleToAddToMap(airlineName));
    }
  };

  const getCoordinatesAndTitleToAddToMap = airlineName =>
    airlineNameList.findIndex(name => name === airlineName);

  useEffect(() => {
    setAirlineObjectData(getListOfAirlinesObject());
    setAirlineIndex("");
    setActiveState({});
  }, [searchValue]);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const dataResultsObjectWithNameAndCoordinates = await Promise.all(
          getUniqueListOfAirportCodes(airlineObjectData).map(
            async airportCode => {
              const getLatitudeLongitudeCoordinatesFromAPI =
                await axiosCallToLatitudeAndLongitudeCoordinates(
                  internationalSearchValue === "false" ? "icao" : "iata",
                  airportCode,
                );

              return {
                name: airportCode,
                ...getLatitudeLongitudeCoordinatesFromAPI,
              };
            },
          ),
        );

        const compareListToFindMatchingCodes = airlineObjectData.map(
          airline => {
            const destinationCoordinates = airline.codes.map(matchingName => {
              const airlines = dataResultsObjectWithNameAndCoordinates.find(
                object => object.name === matchingName.code,
              );
              return { ...airlines, airport: matchingName.airport };
            });

            return destinationCoordinates;
          },
        );

        const getArrayListOfAirlineNames = airlineObjectData.map(a => a.name);

        setAirlineNameList(getArrayListOfAirlineNames);
        setCoords(compareListToFindMatchingCodes);
      } catch (error) {
        console.log("there was a error " + error);
      }
    };
    getCoordinates();
  }, [dataList, searchValue, airlineObjectData, internationalSearchValue]);

  return (
    <div className="d-flex flex-column flex-lg-row">
      <AirlineMapList
        airlineObjectData={airlineObjectData}
        activeStateWhenClicked={getActiveState}
        onClick={handleStateClick}
      />
      <StateMap displayMap={dataList} centerPointOfMap={searchValue}>
        <DisplayMarkers coords={coords} airlineIndex={airlineIndex} />
      </StateMap>
    </div>
  );
}
