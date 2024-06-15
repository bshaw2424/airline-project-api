import axios from "axios";

export const axiosCallToLatitudeAndLongitudeCoordinates = async (
  type,
  airportCode,
) => {
  // environment variable for api-ninjas api
  const ninjaApiKey = process.env.REACT_APP_NINJA_API_KEY;

  try {
    const url = `https://api.api-ninjas.com/v1/airports?${type}=${airportCode}`;

    // axios call with the url
    const response = await axios.get(url, {
      headers: { "X-Api-Key": ninjaApiKey },
    });

    // axios response data
    const airportData = response.data[0];

    if (airportData) {
      const { latitude, longitude } = airportData;
      return { lat: latitude, lng: longitude };
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${airportCode}:`, error);
    return null;
  }
};
