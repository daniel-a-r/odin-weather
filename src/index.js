// const options = {
//   enableHighAccuracy: true
// };

// function success(pos) {
//   const crd = pos.coords;

//   console.log("Your current position is:");
//   console.log(`Latitude : ${crd.latitude}`);
//   console.log(`Longitude: ${crd.longitude}`);
//   console.log(`More or less ${crd.accuracy} meters.`);
// }

// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }

// navigator.geolocation.getCurrentPosition(success, error, options);

const getWeather = async (location) => {
  const baseURL =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  // eslint-disable-next-line no-undef
  const apiKey = process.env.VISUALCROSSING_API_KEY;
  const encodedLocation = encodeURIComponent(location);
  const fullURL = `${baseURL}${encodedLocation}/?key=${apiKey}`;
  console.log(fullURL);
  const response = await fetch(fullURL);
  const json = await response.json();
  console.log(json);
  const currentConditions = json.currentConditions;
  const days = json.days;
  const desc = json.description;
  const resolvedAddress = json.resolvedAddress;
  console.log({ currentConditions, days, desc, resolvedAddress });
};

getWeather('queens, ny');
