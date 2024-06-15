import { changeAirportCodeToIcaoCode,getUniqueListOfAirportCodes } from "../Utilities";

class AxiosMethod{
    getListOfDestinationCoordinatesToDisplayOnMap = async (searchBybooleanValueForInternationalOrDomesticLocations, array, searchValue) => {
    
          return array.map(location =>
            location.destinations
              .filter(
                // filter where the destination of state is equal to user input and is not international
                destination =>
                  destination.state === searchValue &&
                  destination.international ===
                    searchBybooleanValueForInternationalOrDomesticLocations,
              )
              .map(destination => {
                // gets the filtered airport codes results and changes them into icao codes instead of iata
                const { airport_code } = destination;
                return changeAirportCodeToIcaoCode(airport_code);
              }),
          );
    }

    async dataResults(){
        await Promise.all(
            getUniqueListOfAirportCodes(getArrayOfAirportCodes).map(
              async locationInformationNameAndCoordinates => {
                const getLatitudeLongitudeCoordinatesFromAPI =
                  await axiosCallToLatitudeAndLongitudeCoordinates(
                    locationInformationNameAndCoordinates,
                  );

                return {
                  name: locationInformationNameAndCoordinates,
                  coordinates: getLatitudeLongitudeCoordinatesFromAPI,
                };
              },
            ),
          );
    }

        coordinates = getArrayOfAirportCodes.map(code => {
            return code.map(coord => coord);
          });

          // puts the lat and lng coordinates in a object
          const changeCoords = coordinates.map(coords =>
            coords.map(matchingName => {
              const findMatchingName =
                dataResultsObjectWithNameAndCoordinates.find(
                  object => object.name === matchingName,
                );
              return findMatchingName
                ? findMatchingName.coordinates
                : matchingName;
            }),
          );

        
}

export default AxiosMethod