import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AirlineStateSearch from "./Map/AirlineStateSearch";
import Airlines from "./Airlines";

// External Javascript functions in utilities file
import {
  upperCaseFirstLetterOfWord,
  displayMessageIfSearchInputNotFound,
} from "../Utilities";
import Form from "../components/Form/Form";
import AirlineDisclaimer from "../components/AirlineDisclaimer";
import DisplayAirportCodeTitle from "./DisplayAirportCodeTitle";
import Error from "./Error/Error";
import Loader from "./Loader";

export default function AirlineLanding() {
  const navigation = useNavigation();
  console.log(navigation.state);
  const getAirlineDataFromLoader = useLoaderData();

  // state management methods

  const [formSearch, setFormSearch] = useState();
  const [formValues, setFormValues] = useState("");
  const [selectOption, setSelectOption] = useState("default");
  const [filterIcons, setFilterIcons] = useState();
  const [previousFormValue, setPreviousFormValue] = useState("");
  const [airportSearch, setAirportSearch] = useState();
  const [mapSearch, setMapSearch] = useState();
  const [airportSearchMessage, setAirportSearchMessage] = useState("");
  const [airportCodeErrorMessage, setAirportCodeErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [dropDownValue, setDropDownValue] = useState(false);
  const [links, setLinks] = useState(true);

  const getLowerCaseUniqueListOfStateDestination = () => {
    const airline = getAirlineDataFromLoader
      .map(item =>
        item.destinations
          .filter(item => item.international === "true")
          .map(a => a.state.toLowerCase()),
      )
      .reduce((a, b) => a.concat(b), []);

    return [...new Set(airline)];
  };

  const findValue = getLowerCaseUniqueListOfStateDestination().includes(
    previousFormValue.toLowerCase(),
  );

  function removeNonAlphabetic(inputString) {
    return inputString.replace(/[^a-zA-Z\s]/g, "");
  }

  const getLengthOfDestinationsForState = getAirlineDataFromLoader
    .map(getDestination => ({
      codes: getDestination.destinations
        .filter(
          location =>
            location.state === upperCaseFirstLetterOfWord(previousFormValue),
        )
        .map(location => location.airport_code),
    }))
    .filter(arrayList => arrayList.codes.length !== 0).length;

  const objectOfAirlineLengthAndAirportName = () => {
    return {
      airlineAirportLength: getAirlineDataFromLoader
        .map(a =>
          a.destinations.filter(
            a => a.airport_code === formValues.toUpperCase(),
          ),
        )
        .filter(a => a.length !== 0).length,
      airportName: getAirlineDataFromLoader
        .map(a =>
          a.destinations.filter(
            a => a.airport_code === formValues.toUpperCase(),
          ),
        )
        .filter(a => a.length !== 0)
        .map(airline => airline.map(a => a.airport_name))[0],
    };
  };

  const { airlineAirportLength, airportName } =
    objectOfAirlineLengthAndAirportName();

  let errorMessage;
  if (selectOption === "airport_code") {
    errorMessage = "Airport Code";
  } else {
    errorMessage = "State or International Destination";
  }

  useEffect(() => {
    if (selectOption === "state" && getLengthOfDestinationsForState !== 0) {
      setMapSearch(true);
      setLinks(false);
      setError(false);
      setAirportCodeErrorMessage("");
    }

    if (selectOption === "airport_code") {
      setLinks(true);
      setMapSearch(false);
    }
  }, [getLengthOfDestinationsForState, selectOption, previousFormValue]);

  const formChange = e => {
    setFormValues(removeNonAlphabetic(e.target.value));
  };

  const handleOptionChange = e => {
    setSelectOption(e.target.value);

    if (e.target.value === "state") {
      setError(false);
      setAirportSearch(false);
      setFilterIcons("");
      setAirportSearchMessage("");
    }
    if (e.target.value === "airport_code") {
      setError(false);
      setAirportSearch(true);
      setMapSearch(false);
      setPreviousFormValue("");
    }
  };

  const handleAirportCodeSearch = inputValue => {
    if (airlineAirportLength !== 0) {
      setAirportSearch(true);
      setError(false);
      setMapSearch(false);
      setAirportSearchMessage(
        <DisplayAirportCodeTitle
          selectOption={selectOption}
          airlineAirportLength={airlineAirportLength}
          airportFormValue={inputValue}
          airportName={airportName}
        />,
      );
    } else {
      setError(true);
      setAirportSearchMessage("");
    }
  };

  const handleStateSearch = () => {
    if (airlineAirportLength === 0) {
      setLinks(true);
    }
  };

  const handleErrorMessages = (inputValue, errorMessage) => {
    setAirportCodeErrorMessage(
      <>{`${inputValue.toUpperCase()} is not a valid ${errorMessage}`}</>,
    );
  };

  const handleFormSearch = inputValue => {
    !displayMessageIfSearchInputNotFound(
      getAirlineDataFromLoader,
      selectOption,
      inputValue,
    ).includes(true)
      ? setFormSearch(true)
      : setFormSearch(false);
  };

  const airlineSearch = e => {
    e.preventDefault();

    const inputValueSubmittedFromForm = formValues;

    setPreviousFormValue(inputValueSubmittedFromForm);
    setFilterIcons(selectOption);

    if (selectOption === "airport_code") {
      handleAirportCodeSearch(inputValueSubmittedFromForm);
    } else if (selectOption === "state") {
      handleStateSearch();
    }

    handleErrorMessages(inputValueSubmittedFromForm, errorMessage);
    setFormValues("");
    setDropDownValue(true);

    if (
      selectOption === "state" &&
      inputValueSubmittedFromForm === previousFormValue
    ) {
      setError(false);
    }

    handleFormSearch(inputValueSubmittedFromForm);
  };

  return (
    <>
      {navigation.state !== "loading" && (
        <section>
          <Form
            onSubmit={e => airlineSearch(e)}
            handleOptionChange={e => handleOptionChange(e)}
            formChange={e => formChange(e)}
            formValue={formValues}
            selectOption={selectOption}
          />
          {airportSearch && airportSearchMessage}
          {error && (
            <Error message={airportCodeErrorMessage} messageDiv={error} />
          )}
          <AnimatePresence>
            {links && (
              <motion.section
                className="my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: links ? 1 : 0 }}
                transition={{ delay: 0.5 }}
              >
                <Airlines
                  targetInput={previousFormValue.toUpperCase()}
                  showIconForAirportCode={filterIcons}
                  airportCodeErrorMessage={airportCodeErrorMessage}
                  showMessage={links}
                />
              </motion.section>
            )}
          </AnimatePresence>
          <div className="container">
            <AirlineStateSearch
              airlineSearch={getAirlineDataFromLoader}
              targetCategoryValue={upperCaseFirstLetterOfWord(
                previousFormValue,
              )}
              internationalSearchValue={String(findValue)}
              selectOptionValue={selectOption}
              airportName={airportName}
              mapSearch={mapSearch}
              value={dropDownValue}
              closeButton={setMapSearch}
              airlineButtons={setLinks}
            />

            <AirlineDisclaimer />
          </div>
        </section>
      )}

      {navigation.state === "loading" && (
        <>
          <Loader loading={true} />
        </>
      )}
    </>
  );
}

export const destinationIndexLoader = async () => {
  const response = await axios.get(
    `https://whale-app-v8vd4.ondigitalocean.app/api/airlinesairlines/info`,
  );

  return response.data;
};
