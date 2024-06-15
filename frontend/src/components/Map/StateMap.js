import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { stateAndCountryCoordinates } from "./StateCountryArrays";
import { useEffect, useState } from "react";
import Loader from "../Loader";

export default function StateMap({ displayMap, centerPointOfMap, children }) {
  const [coordinates, setCoordinates] = useState({});

  // gets the center point of the map for state/country based on the input from the form
  useEffect(() => {
    const filteredCoordinates = stateAndCountryCoordinates.filter(
      destination => destination.name === centerPointOfMap,
    );

    if (filteredCoordinates.length > 0) {
      const { lat, lng } = filteredCoordinates[0];
      setCoordinates({ lat, lng });
    }
  }, [centerPointOfMap]);

  const sizeOfMapDisplayContainer = {
    width: "100%",
    height: "600px",
  };

  const api_key = process.env.REACT_APP_API_KEY;

  // if map gets loaded
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: api_key,
  });

  return isLoaded ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      {/* google maps */}
      <GoogleMap
        style={{ zIndex: 0 }}
        mapContainerStyle={sizeOfMapDisplayContainer}
        center={coordinates}
        zoom={5}
        options={{
          zoomControl: false,
          streetView: true,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {children}
      </GoogleMap>
    </div>
  ) : (
    <>
      <Loader loading={!isLoaded} />
    </>
  );
}
