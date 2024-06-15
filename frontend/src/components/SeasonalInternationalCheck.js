export default function SeasonalInternationalCheck({
  destinationCategory,
  stringBooleanValue,
}) {
  return (
    <div
      style={{ width: "100%" }}
      className="d-flex flex-column align-items-sm-start justify-content-center align-items-lg-end seasonal-check"
    >
      <p aria-label="international destination">
        <b>International: </b>
        {destinationCategory["international"] === stringBooleanValue
          ? "Yes"
          : "No"}
      </p>
      <p aria-label="seaosnal destination">
        <b>Seasonal: </b>
        {destinationCategory["seasonal"] === stringBooleanValue ? "Yes" : "No"}
      </p>
    </div>
  );
}
