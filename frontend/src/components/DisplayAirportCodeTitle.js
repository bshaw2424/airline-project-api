import { upperCaseFirstLetterOfWord } from "../Utilities";

export default function DisplayAirportCodeTitle({
  selectOption,
  airlineAirportLength,
  airportFormValue,
  airportName,
}) {
  return (
    <div className="container mb-lg-5 mt-lg-3 mt-sm-5" id="display-title">
      <h1 className="w-100 text-center border-dark bg-dark text-white py-3 rounded-4">
        {`${airlineAirportLength} out of 10 airlines fly to `}
        {selectOption === "airport_code" && airlineAirportLength !== 0
          ? airportFormValue.toUpperCase()
          : upperCaseFirstLetterOfWord(airportFormValue)}
      </h1>
      <h3 className="mt-3">
        {selectOption === "airport_code" ? `${airportName}` : ""}
      </h3>
    </div>
  );
}
