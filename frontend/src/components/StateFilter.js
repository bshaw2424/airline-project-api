import { useState, useEffect } from "react";
import { getStates } from "../Utilities";
import SelectElement from "./SelectElement";

export default function StateFilter({
  destinations,
  onChange,
  dropdownItem,
  currentSelectValue,
}) {
  const [defaultSelectItem, setDefaultSelectItem] = useState("default");

  useEffect(() => {
    setDefaultSelectItem(dropdownItem ? "default" : currentSelectValue);
  }, [dropdownItem, currentSelectValue, defaultSelectItem]);

  return (
    <div className="mt-3 mt-lg-0 ms-xl-3">
      <SelectElement
        className="form-select"
        aria-label="Destination Location Dropdown Menu"
        onChange={onChange}
        defaultValue={defaultSelectItem}
        key={defaultSelectItem}
      >
        <option value="default">Filter By State / Country</option>
        {getStates(destinations).map((airlineDestinationLocation, i) => (
          // take any empty spaces from word then set it to lower case.
          <option
            value={airlineDestinationLocation}
            key={`{airlineDestinationLocation-${i}`}
          >
            {airlineDestinationLocation}
          </option>
        ))}
      </SelectElement>
    </div>
  );
}
