import SelectElement from "../../components/SelectElement";

export default function SelectMenu({ onChange }) {
  return (
    <>
      <label htmlFor="default"></label>
      <SelectElement
        name="airlineOptions"
        className="form-select w-100 w-sm-50 w-lg-100 py-2 me-4"
        aria-label="Default select example"
        id="search-options"
        defaultValue="default"
        onChange={onChange}
      >
        <option value="default" disabled>
          Select Option
        </option>
        <option value="state">State / Country</option>

        <option value="airport_code">Airport Code</option>
      </SelectElement>
    </>
  );
}
