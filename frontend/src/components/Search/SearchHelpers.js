export const normalize = value => {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const flattenAirlineDestinations = airlines => {
  return airlines.flatMap(airline =>
    (airline.destinations ?? []).map(destination => ({
      ...destination,
      airlineId: airline._id,
      airlineName: airline.name,
      airlineSlug: airline.slug,
      airlineLogo: airline.logo,
      airlineWebsite: airline.website,
    })),
  );
};

const searchAirportCode = (destinations, query) => {
  const normalizedQuery = normalize(query);

  return destinations.filter(
    destination =>
      normalize(destination.airport_code) === normalizedQuery,
  );
};

const searchAirportName = (destinations, query) => {
  const normalizedQuery = normalize(query);

  return destinations.filter(destination =>
    normalize(destination.airport_name).includes(
      normalizedQuery,
    ),
  );
};

const searchCity = (destinations, query) => {
  const normalizedQuery = normalize(query);

  return destinations.filter(
    destination =>
      normalize(destination.city) === normalizedQuery ||
      normalize(destination.name) === normalizedQuery,
  );
};

const searchState = (destinations, query) => {
  const normalizedQuery = normalize(query);

  return destinations.filter(destination => {
    const isInternational =
      destination.international === true ||
      destination.international === "true";

    return (
      normalize(destination.state) === normalizedQuery &&
      !isInternational
    );
  });
};

const searchCountry = (destinations, query) => {
  const normalizedQuery = normalize(query);

  return destinations.filter(destination => {
    const isInternational =
      destination.international === true ||
      destination.international === "true";

    const matchesCountryField =
      normalize(destination.country) === normalizedQuery;

    const matchesCurrentDataStructure =
      normalize(destination.state) === normalizedQuery &&
      isInternational;

    return (
      matchesCountryField ||
      matchesCurrentDataStructure
    );
  });
};

export const findMatches = (destinations, query) => {
  // 1. Airport code should always be checked first.
  let matches = searchAirportCode(destinations, query);

  if (matches.length > 0) {
    return {
      type: "airport code",
      matches,
    };
  }

  // 2. Check state before airport name.
  matches = searchState(destinations, query);

  if (matches.length > 0) {
    return {
      type: "state",
      matches,
    };
  }

  // 3. Check country before airport name.
  matches = searchCountry(destinations, query);

  if (matches.length > 0) {
    return {
      type: "country",
      matches,
    };
  }

  // 4. Check city.
  matches = searchCity(destinations, query);

  if (matches.length > 0) {
    return {
      type: "city",
      matches,
    };
  }

  // 5. Airport name uses partial matching, so check it last.
  matches = searchAirportName(destinations, query);

  if (matches.length > 0) {
    return {
      type: "airport name",
      matches,
    };
  }

  return null;
};

export const groupMatchesByAirline = matches => {
  const airlineMap = new Map();

  for (const destination of matches) {
    const existingAirline = airlineMap.get(
      destination.airlineId,
    );

    if (existingAirline) {
      const alreadyIncluded =
        existingAirline.matchingAirports.some(
          airport =>
            airport.airport_code ===
            destination.airport_code,
        );

      if (!alreadyIncluded) {
        existingAirline.matchingAirports.push(
          destination,
        );
      }

      continue;
    }

    airlineMap.set(destination.airlineId, {
      id: destination.airlineId,
      name: destination.airlineName,
      slug: destination.airlineSlug,
      logo: destination.airlineLogo,
      website: destination.airlineWebsite,
      matchingAirports: [destination],
    });
  }

  return Array.from(airlineMap.values())
    .map(airline => ({
      ...airline,
      matchingAirportCount:
        airline.matchingAirports.length,
    }))
    .sort((a, b) => {
      if (
        b.matchingAirportCount !==
        a.matchingAirportCount
      ) {
        return (
          b.matchingAirportCount -
          a.matchingAirportCount
        );
      }

      return a.name.localeCompare(b.name);
    });
};