import { useState } from "react";

const Destinations = ({ airlines, slug, international }) => {
  return (
    <article className="border border-1">
      {airlines
        .filter(
          airline =>
            airline.slug === slug && airline.international === international,
        )
        .map(destinations => (
          <div>
            {destinations.destinations
              .sort((a, b) => a.airport_code.localeCompare(b.name))
              .map(a => (
                <>
                  <ul>
                    <li>
                      {a.name} <span>{a.airport_code}</span>
                    </li>
                  </ul>

                  <p>{a.airport_name}</p>
                </>
              ))}
          </div>
        ))}
    </article>
  );
};

export default Destinations;
