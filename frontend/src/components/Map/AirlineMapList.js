import { useState, useEffect } from "react";

export default function AirlineMapList({
  airlineObjectData,
  activeStateWhenClicked,
  onClick,
}) {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
  };

  useEffect(() => {
    // Add event listener to detect screen size change
    window.addEventListener("resize", handleResize);
    // Check initial screen size
    handleResize();

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!isMobile ? (
        <div className="px-2 w-25 w-sm-100 w-lg-25">
          <ul className="list-unstyled ps-3 pe-0">
            {airlineObjectData.map((airline, index) => (
              <li
                key={`${airline.name}-${index}`}
                className={`p-1 ps-2 me-4 ms-1 ${
                  activeStateWhenClicked[airline.name] ? "active" : ""
                }`}
                onClick={() => onClick(airline.name)}
                style={{ fontSize: "1.1rem" }}
              >
                {airline.name} - {airline.length}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="dropdown mb-5 w-100">
          <button
            className="btn btn-white border border-dark dropdown-toggle w-100"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ fontSize: "1.3rem", background: "#333", color: "#fff" }}
          >
            Airport Destinations
          </button>
          <ul
            className="dropdown-menu bg-blue w-100 airlineList"
            aria-labelledby="dropdownMenuButton1"
            style={{ background: "rgb(255, 255, 255)", zIndex: 1 }}
          >
            {airlineObjectData.map((airline, index) => (
              <li
                key={`${airline.name}-${index}`}
                style={{
                  padding: "0 0 .5rem 30%",
                  fontSize: "1.3rem",
                  color: "#333",
                }}
                className={`w-100 ${
                  activeStateWhenClicked[airline.name] ? "active" : ""
                }`}
                onClick={() => {
                  onClick(airline.name);
                }}
              >
                {airline.name} - {airline.length}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
