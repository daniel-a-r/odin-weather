import './style.css';

const displayLoadingCurrentLocation = () => {
  const infoDiv = document.querySelector('div.info');
  const para = document.createElement('p');
  para.textContent = 'Getting coordinates';
  infoDiv.appendChild(para);
};

const displayLoadingWeather = (location) => {
  const infoDiv = document.querySelector('div.info');
  const para = document.createElement('p');
  para.textContent = `Getting weather for ${location}`;
  infoDiv.appendChild(para);
};

const getIcon = async (iconName) => {
  const module = await import(`./assets/${iconName}.svg`);
  return module.default;
};

const displayWeather = async (weather) => {
  console.log(weather);
  const currentConditions = weather.currentConditions;
  const conditions = currentConditions.conditions;
  const days = weather.days;
  const desc = weather.description;
  const resolvedAddress = weather.resolvedAddress;
  console.log({ currentConditions, days, desc, conditions, resolvedAddress });
  console.log(currentConditions.icon);
  const icon = await getIcon(currentConditions.icon);
  console.log(icon);
};

const clearInfo = () => {
  const infoDiv = document.querySelector('div.info');
  while (infoDiv.hasChildNodes()) {
    infoDiv.removeChild(infoDiv.firstChild);
  }
};

const getCurrentPosition = async () => {
  const success = (pos) => {
    clearInfo();
    const crd = pos.coords;
    const textInput = document.querySelector('input');
    textInput.value = `${crd.latitude}, ${crd.longitude}`;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    getWeather(`${crd.latitude},${crd.longitude}`);
  };

  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const options = {
    enableHighAccuracy: true,
  };

  displayLoadingCurrentLocation();
  setTimeout(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, 1000);
};

const addressSubmit = (event) => {
  event.preventDefault();
  const formElem = event.currentTarget;
  const data = new FormData(formElem);
  console.log(data.get('text'));
  getWeather(data.get('text'));
};

const getWeather = async (location) => {
  displayLoadingWeather(location);
  setTimeout(async () => {
    const baseURL =
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    // eslint-disable-next-line no-undef
    const apiKey = process.env.VISUALCROSSING_API_KEY;
    const encodedLocation = encodeURIComponent(location);
    const fullURL = `${baseURL}${encodedLocation}/?iconSet=icons2&key=${apiKey}`;
    console.log(fullURL);
    const response = await fetch(fullURL);
    const json = await response.json();
    clearInfo();
    await displayWeather(json);
  }, 1000);
};

(() => {
  const currentPosBtn = document.querySelector('button.current-position');
  const form = document.querySelector('form');
  currentPosBtn.addEventListener('click', getCurrentPosition);
  form.addEventListener('submit', addressSubmit);
})();
