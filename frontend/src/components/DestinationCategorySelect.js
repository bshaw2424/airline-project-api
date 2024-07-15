import { useEffect, useState } from "react";
import SelectElement from "./SelectElement";

export const DestinationCategorySelect = ({
  InternationalData,
  Domestic,
  SeasonalData,
  setDestinationErrorMessage,
  selectValue,
  stateFilterSelect,
  setDefaultSetting,
}) => {
  const [value, setValue] = useState("domestic");

  const showAirlineFlightList = e => {
    if (e.target.value === "international") {
      InternationalData(e);
    }
    if (e.target.value === "domestic") {
      Domestic(e);
    }
    if (e.target.value === "seasonal") {
      SeasonalData(e);
    }
    if (e.target.value === "default") {
      setDefaultSetting();
    }
  };

  useEffect(() => {
    setValue(!selectValue && "default");
  }, [selectValue, stateFilterSelect]);

  const changeValue = e => {
    setDestinationErrorMessage(e.target.value);
    showAirlineFlightList(e);
    stateFilterSelect(true);
  };

  return (
    <div className="width mb-3 mb-lg-0">
      <SelectElement
        className="form-select"
        style={{ width: "50%" }}
        onChange={changeValue}
        defaultValue={value}
        key={value}
      >
        <option value="default">Total Destinations</option>
        <option value="domestic">Domestic</option>
        <option value="international">International</option>
        <option value="seasonal">Seasonal</option>
      </SelectElement>
    </div>
  );
};
