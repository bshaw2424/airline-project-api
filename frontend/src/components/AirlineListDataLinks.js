import { useState } from "react";
import AirlineDataModal from "./AirlineDataModal";
import ThumbsUpIcon from "./ThumbsUpIcon";

const styles = {
  width: "96%",
  position: "relative",
  cursor: "pointer",
  background: "#fff",
};

export default function AirlineListDataLinks({ airlineNameData, icons }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = index => setHoveredIndex(index);

  const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <section>
      <div className="airline-divs mb-0">
        {airlineNameData.map((airline, index) => (
          <div
            style={styles}
            key={`${airline.name}-${index}`}
            className={`Links mb-4 rounded airlineNameLink ${
              hoveredIndex === index ? "shadow" : "border border-1 border-dark "
            } Link-${index + 1} py-2`}
            data-bs-toggle="modal"
            data-bs-target={`#airlineModalData-${airline._id}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <h2
              style={{
                maxWidth: "100%",
                textAlign: "center",
              }}
              className="pt-2"
            >
              {airline.name}
            </h2>

            {/* displays thumbs up icons with valid airport code look up */}
            {icons[index] && <ThumbsUpIcon />}
            <AirlineDataModal
              airlines={airline}
              id={`airlineModalData-${airline._id}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
