import "./style.css";

const API_KEY = "VXG7GBWM2JRTWQAQLNZTR3P8G";

const form = document.querySelector("form");
const cityBox = document.querySelector("#city-holder");
const datetimeBox = document.querySelector("#datetime-holder");
const conditionsBox = document.querySelector("#conditions-holder");
const iconBox = document.querySelector("#icon-holder");
const tempBox = document.querySelector("#temp-holder");

const WEATHER_CONFIG = {
  city: {
    box: cityBox,
    label: null,
    format: null,
  },
  datetime: {
    box: datetimeBox,
    label: "La date : ",
    format: null,
  },
  conditions: {
    box: conditionsBox,
    label: "Les conditions sont : ",
    format: null,
  },
  icon: {
    box: iconBox,
    label: null,
    format: null,
  },
  temp: {
    box: tempBox,
    label: "La température est de : ",
    format: (v) => `${v}°C`,
  },
};

async function getWeather(city) {
  const unitGroup = "metric";
  const include = "days,hours,current";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unitGroup}&include=${include}&key=${API_KEY}&lang=fr`;

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    console.error("error fetching: ", err);
    return;
  }

  if (!response.ok) {
    console.error(`Error HTTP: code-${response.status} ${response.statusText}`);
    return;
  }

  let json;
  try {
    json = await response.json();
    const cleanedJson = parseJson(json);
    renderWeather(cleanedJson);
    console.log(json);
    console.log(cleanedJson);
  } catch (err) {
    console.error("error parsing/rendering: ", err);
    return;
  }
}

function parseJson(json) {
  const obj = {};
  obj.city = json.address;
  obj.datetime = json.currentConditions.datetime;
  obj.conditions = json.currentConditions.conditions;
  obj.icon = json.currentConditions.icon;
  obj.temp = json.currentConditions.temp;
  return obj;
}

function renderWeather(obj) {
  for (const [key, { box, label, format }] of Object.entries(WEATHER_CONFIG)) {
    const value = obj[key];
    const formatted = format ? format(value) : value;
    box.textContent = label ? `${label} ${formatted}` : formatted;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = event.target["city"].value;
  getWeather(city);
  form.reset();
});
