import { upperCaseFirstLetterOfWord } from "../Utilities";

export default function DisplayAirportCodeTitle({
  selectOption,
  airlineAirportLength,
  airportFormValue,
  airportName,
}) {
  return (
    <section className="container">
      <div className="mb-lg-5 mt-lg-0 mt-sm-5 " id="display-title">
        <h1 className="text-center text-dark py-2 rounded-4 border border-dark">
          {`${airlineAirportLength} out of 10 airlines fly to `}
          {selectOption === "airport_code" && airlineAirportLength !== 0
            ? airportFormValue.toUpperCase()
            : upperCaseFirstLetterOfWord(airportFormValue)}
        </h1>
        <h3 className="mt-3">
          {selectOption === "airport_code" ? `${airportName}` : ""}
        </h3>
      </div>
    </section>
  );
}
