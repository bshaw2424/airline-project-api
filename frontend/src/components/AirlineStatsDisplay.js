import { useState } from "react";
import {
  getNameOfAirportFromAirportCodeInput,
  upperCaseFirstLetterOfWord,
  displayMessageIfSearchInputNotFound,
  getNumberLengthOfSearch,
} from "../Utilities";

export default function AirlineStatsDisplay({
  airline,
  selectFormOptionvalue,
  inputValue,
}) {
  const [airlineTitle, setAirlineTitle] = useState();
  return (
    <>
      {airlineLengthSearch === 0
        ? setAirlineTitle("")
        : setAirlineTitle(
            `${airlineLengthSearch} of 10 airlines fly to ${
              selectFormOptionvalue === "airport_code"
                ? `${inputValue.toUpperCase()} - ( ${getNameOfAirportFromAirportCodeInput(
                    airline,
                    inputValue.toUpperCase(),
                  )} )`
                : upperCaseFirstLetterOfWord(inputValue)
            }`,
          )}
      !displayMessageIfSearchInputNotFound( airline, selectFormOptionvalue,
      inputValue, ).includes(true) ? setFormSearch(true) : setFormSearch(false);
    </>
  );
}
