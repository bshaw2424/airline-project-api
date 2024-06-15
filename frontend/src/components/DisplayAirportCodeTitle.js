import { upperCaseFirstLetterOfWord } from "../Utilities";

export default function DisplayAirportCodeTitle({
  selectOption,
  airlineAirportLength,
  airportFormValue,
  airportName,
}) {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column container"
      id="display-title"
    >
      <h1 className="w-100 text-center border border-1 border-dark py-3 rounded container text-dark">
        {`${airlineAirportLength} out of 10 airlines fly to `}
        {selectOption === "airport_code" && airlineAirportLength !== 0
          ? airportFormValue.toUpperCase()
          : upperCaseFirstLetterOfWord(airportFormValue)}
      </h1>
      <h3 className="mt-3">
        {selectOption === "airport_code" ? `  ${airportName}` : ""}
      </h3>
    </div>
  );
}
