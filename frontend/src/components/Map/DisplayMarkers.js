import { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { getIataCodeFromIcaoCode } from "../../Utilities";

export default function DisplayMarkers({ coords, airlineIndex }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = title => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        title,
      )}`,
      "_blank",
    );
  };

  return (
    <>
      {coords &&
        coords[airlineIndex] &&
        coords[airlineIndex].map((airlineDetails, index) => {
          const { name, lat, lng, airport } = airlineDetails;

          return (
            <Marker
              key={`${airport}-${index}`}
              position={{
                lat: +lat,
                lng: +lng,
              }}
              onMouseOver={() => setSelectedMarker(airlineDetails)}
              onMouseOut={() => setSelectedMarker(null)}
              onClick={() => handleMarkerClick(airport)}
            >
              {selectedMarker === airlineDetails && (
                <InfoWindow>
                  <>
                    <h3
                      className="text-center p-3 border border-1 border-dark shadow rounded"
                      style={{
                        fontSize: "1.3rem",
                        color: "#333",
                      }}
                    >
                      {airport} -{" "}
                      <span style={{ fontWeight: "400" }}>
                        {getIataCodeFromIcaoCode(name)}
                      </span>
                    </h3>
                    <h6 className="text-center">Click marker for details</h6>
                  </>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
    </>
  );
}
