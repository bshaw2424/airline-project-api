export default function AirportCodeSearch({ selectOption, length, message }) {
  return <>{selectOption === "airport_code" && length !== 0 && message}</>;
}
