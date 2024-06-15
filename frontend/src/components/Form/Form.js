import AirlineQuickSearch from "./AirlineQuickSearch";
import { CiSearch } from "react-icons/ci";
import Button from "../Button";
import SelectMenu from "./SelectMenu";

export default function Form({
  onSubmit,
  handleOptionChange,
  formValue,
  formChange,
  selectOption,
}) {
  return (
    <>
      <section style={{ background: "hsla(216, 98%, 54%, 1)" }} id="form">
        <form onSubmit={onSubmit} className="py-2 py-sm-0 w-100">
          <div className="container">
            <div className="form-inputs">
              <SelectMenu onChange={handleOptionChange} />
              <AirlineQuickSearch
                selectOption={selectOption}
                value={formValue}
                onChange={formChange}
              />
            </div>
            <div className="form-button">
              <Button
                buttonType="submit"
                className={`btn btn-light ${
                  selectOption === "default" ? "disabled" : null
                }`}
                href="#stateDestinationMap"
              >
                <CiSearch />
              </Button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
