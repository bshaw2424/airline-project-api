export default function AirlineQuickSearch({ value, onChange, selectOption }) {
  return (
    <>
      <label htmlFor="airportDataInput"></label>
      <input
        style={{ cursor: selectOption === "default" ? "not-allowed" : null }}
        className="form-inputField px-3"
        type="text"
        name="data"
        autoFocus={true}
        disabled={selectOption === "default" ? true : false}
        id="airportDataInput"
        onChange={onChange}
        value={value}
        required
      />
    </>
  );
}
