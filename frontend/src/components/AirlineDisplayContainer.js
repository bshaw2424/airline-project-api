// import statements
import { useEffect, useState } from "react";
import AirlineDropdownList from "./AirlineDropdownList";
import DisplayFilterList from "./DisplayFilterList";
import { upperCaseFirstLetterOfWord } from "../Utilities";
import ShowDataList from "./ShowDataList";
import StateFilter from "./StateFilter";
import TotalDestinationNumber from "./TotalDestinationNumber";
import AirlineInformationDisplay from "./AirlineInformationDisplay";
import NotificationPage from "./NotificationPage";
import Loader from "./Loader";
import { DestinationCategorySelect } from "./DestinationCategorySelect";

export default function AirlineDisplayContainer({ destinations }) {
  // state management

  const [domesticData, setDomesticData] = useState(true);
  const [internationalData, setInternationalData] = useState(false);
  const [seasonalData, setSeasonalData] = useState(false);
  const [selectChange, setSelectChange] = useState(false);
  const [dropdownItem, setDropdownItem] = useState(false);

  const [notificationMessage, setNotificationMessage] = useState(false);
  const [destinationNumber, setDestinationNumber] = useState(
    destinations.destinations.filter(
      listData => listData.international === "false",
    ).length,
  );
  const [locationState, setLocationState] = useState("");
  const [locationShow, setLocationShow] = useState(true);
  const [destinationErrorMessage, setDestinationErrorMessage] = useState("");
  const [currentSelectValue, setCurrentSelectValue] = useState("");
  const [clickChange, setClickChange] = useState(false);
  const [airlineName, setAirlineName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Methods
  function filteredLists(category, stringBoolean) {
    const dataList = destinations.destinations.filter(
      listData => listData[category] === stringBoolean,
    );
    return dataList.length;
  }

  function getTotalFilteredDestinationNumber(e, category, value) {
    const destinationTotalNumber = destinations.destinations
      .filter(destination => destination[category] === value)
      .map(a => a.name).length;

    if (destinationTotalNumber > 1) {
      setDestinationNumber(destinationTotalNumber);
      setNotificationMessage(false);
    }
    if (destinationTotalNumber < 1) {
      setNotificationMessage(true);
      setDestinationNumber(destinationTotalNumber);
      setDestinationErrorMessage(
        `No ${upperCaseFirstLetterOfWord(e.target.value)} Destinations`,
      );
    }
  }

  const loadingPromise = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1100);
      resolve();
      setIsLoading(true);
    });
  };

  function getFilteredStatesDestinationNumber(targetElement) {
    const getDestinationStateDropdownTotal = destinations.destinations.filter(
      a => a.state === targetElement.target.value,
    ).length;

    if (targetElement.target.value) {
      setDestinationNumber(
        `${targetElement.target.value} - ${getDestinationStateDropdownTotal}`,
      );
    }
    setNotificationMessage(false);
  }

  const Domestic = e => {
    setDestinationNumber(filteredLists("international", "false"));
    getTotalFilteredDestinationNumber(e, "international", "false");
    setLocationState(e.target.value);
    setDomesticData(true);
    setInternationalData(false);
    setSeasonalData(false);
    setLocationShow(false);
  };

  const InternationalData = e => {
    setDestinationNumber(filteredLists("international", "false"));
    getTotalFilteredDestinationNumber(e, "international", "true");
    setLocationState(e.target.value);
    setDomesticData(false);
    setInternationalData(true);
    setSeasonalData(false);
    setLocationShow(false);
  };

  const SeasonalData = e => {
    setDestinationNumber(filteredLists("seasonal", "false"));
    getTotalFilteredDestinationNumber(e, "seasonal", "true");
    setSeasonalData(true);
    setLocationState(e.target.value);
    setDomesticData(false);
    setInternationalData(false);
    setLocationShow(false);
  };

  function setDefaultSetting() {
    setDomesticData(true);
    setInternationalData(false);
    setSeasonalData(false);
  }

  // resets the destination select when the state/country select menu is active
  useEffect(() => {
    !domesticData && setSelectChange(true);
    // clickChange && setDomesticData(false);
  }, [domesticData, selectChange, dropdownItem, clickChange]);

  // change number of flights total to correspond with associated airline when airline value changed.
  // Defaults to Domestic total
  useEffect(() => {
    setDestinationNumber(
      destinations.destinations.filter(
        listData => listData.international === "false",
      ).length,
    );
  }, [destinations.destinations]);

  function handleLocationChange(e) {
    getFilteredStatesDestinationNumber(e);
    setLocationState(e.target.value);
    setLocationShow(true);
    setInternationalData(false);
    setDomesticData(false);
    setSeasonalData(false);
    setDestinationErrorMessage("");
    setSelectChange(false);
    setDropdownItem(false);
    setCurrentSelectValue(e.target.value);
    setClickChange(false);
  }

  function resetDestination(e) {
    loadingPromise();
    setAirlineName(e.target.innerText);

    if (e.target.value !== "default") {
      setLocationState("default");
      setDomesticData(true);
      setSeasonalData(false);
      setInternationalData(false);
    }
    setCurrentSelectValue("default");
  }

  return (
    <>
      {isLoading ? (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader loading={isLoading} />
        </div>
      ) : (
        <>
          <section className="container">
            <div className="d-flex flex-column flex-sm-column flex-xl-row justify-content-xl-between align-items-center">
              <AirlineInformationDisplay airline={destinations} />

              <TotalDestinationNumber
                totalFightDestinations={destinationNumber}
              />
            </div>

            {/* filter through airline data buttons */}
            <section
              style={{ display: "flex", justifyContent: "space-between" }}
              className="d-flex w-100 flex-column flex-sm-column flex-xl-row justify-content-xl-between align-items-center p-3 mt-3  mb-sm-5 mb-lg-4 mb-4 button-contain rounded"
            >
              <DestinationCategorySelect
                InternationalData={InternationalData}
                Domestic={Domestic}
                SeasonalData={SeasonalData}
                setDestinationErrorMessage={setDestinationErrorMessage}
                selectValue={selectChange}
                stateFilterSelect={setDropdownItem}
                setDefaultSetting={setDefaultSetting}
              />

              <div className="d-flex flex-column flex-xl-row flex-sm-column  align-items-xl-center justify-content-xl-end width">
                <AirlineDropdownList
                  getAirlineUrl={resetDestination}
                  destinations={destinations}
                />

                <StateFilter
                  onChange={handleLocationChange}
                  destinations={destinations}
                  dropdownItem={dropdownItem}
                  currentSelectValue={currentSelectValue}
                />
              </div>
            </section>
          </section>
          <section>
            <div className="container py-3">
              {/* shows international list */}
              {internationalData && (
                <ShowDataList
                  destinations={destinations}
                  dataCategory={"international"}
                  value={"true"}
                />
              )}

              {/* shows seasonal list  */}
              {seasonalData && (
                <ShowDataList
                  destinations={destinations}
                  dataCategory={"seasonal"}
                  value={"true"}
                />
              )}

              {/* shows domestic list */}

              {domesticData && (
                <ShowDataList
                  destinations={destinations}
                  dataCategory={"international"}
                  value={"false"}
                />
              )}

              {locationShow && (
                <DisplayFilterList
                  getDestinationsData={destinations}
                  targetValue={locationState}
                />
              )}

              {notificationMessage && (
                <NotificationPage destinationType={destinationErrorMessage} />
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
