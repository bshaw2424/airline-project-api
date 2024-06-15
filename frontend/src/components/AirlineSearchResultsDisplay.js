export default function AirlineSearchResultsDisplay({ selectOptionValue }) {
  return (
    <>
      {selectOptionValue === "state" && (
        <div className="text-center">
          <p>
            ( <b>*</b> Number of destinations within state / country )
          </p>
        </div>
      )}
    </>
  );
}
