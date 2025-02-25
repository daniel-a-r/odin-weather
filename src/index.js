const currentLocationLoading = () => {
  const statusDiv = document.querySelector('div.status');
  statusDiv.textContent = 'Getting current location';
};

const displayCoords = (coords) => {
  const statusDiv = document.querySelector('div.status');
  statusDiv.textContent = `${coords.latitude}, ${coords.longitude}`;
};

const clearStatus = () => {
  const statusDiv = document.querySelector('div.status');
  statusDiv.textContent = '';
};

const getCurrentPosition = async () => {
  const success = (pos) => {
    clearStatus();
    const crd = pos.coords;
    const textInput = document.querySelector('input');
    textInput.value = `${crd.latitude}, ${crd.longitude}`;
    // getWeather(`${crd.latitude},${crd.longitude}`);

    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
  };

  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const options = {
    enableHighAccuracy: true,
  };

  currentLocationLoading();
  navigator.geolocation.getCurrentPosition(success, error, options);
  
  // permissionStatus.addEventListener('change', (e) => {
  //   console.log(e);
  // });
};

const addressSubmit = (event) => {
  event.preventDefault();
  const formElem = event.currentTarget;
  const data = new FormData(formElem);
  console.log(data.get('text'));
  getWeather(data.get('text'));
};

const getIcon = async (iconName) => {
  const module = await import(`./assets/${iconName}.svg`);
  return module.default;
};

const getWeather = async (location) => {
  const baseURL =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  // eslint-disable-next-line no-undef
  const apiKey = process.env.VISUALCROSSING_API_KEY;
  const encodedLocation = encodeURIComponent(location);
  const fullURL = `${baseURL}${encodedLocation}/?iconSet=icons2&key=${apiKey}`;
  console.log(fullURL);
  const response = await fetch(fullURL);
  const json = await response.json();
  console.log(json);
  const currentConditions = json.currentConditions;
  const days = json.days;
  const desc = json.description;
  const resolvedAddress = json.resolvedAddress;
  console.log({ currentConditions, days, desc, resolvedAddress });
  console.log(currentConditions.icon);
  const icon = await getIcon(currentConditions.icon);
  console.log(icon);
};

(() => {
  const currentPosBtn = document.querySelector('button.current-position');
  const form = document.querySelector('form');
  navigator.permissions.query({ name: 'geolocation' }).then((result) => {
    console.log(result);
    result.onchange = (ev) => {
      console.log(ev);
    };
  });
  currentPosBtn.addEventListener('click', getCurrentPosition);
  form.addEventListener('submit', addressSubmit);
})();
