import "./style.css";

const API_KEY = "VXG7GBWM2JRTWQAQLNZTR3P8G";

const form = document.querySelector("form");
const forecast = document.querySelector(".forecast");

const loader = document.querySelector(".loader");

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
    format: importIcon,
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
    await renderWeather(cleanedJson);
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

async function renderWeather(obj) {
  for (const [key, { box, label, format }] of Object.entries(WEATHER_CONFIG)) {
    const value = obj[key];
    const formatted = format ? await format(value) : value;
    if (key === "temp") {
      toogleForecast(value);
    }
    if (key === "icon") {
      box.innerHTML = formatted;
    } else {
      box.textContent = label ? `${label} ${formatted}` : formatted;
    }
  }
}

async function importIcon(icon) {
  const module = await import("./icons/" + icon + ".svg");
  const url = module.default;
  const response = await fetch(url);
  const svgText = await response.text();
  return svgText;
}

function toogleForecast(temp) {
  if (temp < 10) {
    forecast.classList.add("cold");
    forecast.classList.remove("hot");
    forecast.classList.remove("moderate");
  } else if (temp < 20) {
    forecast.classList.remove("cold");
    forecast.classList.remove("hot");
    forecast.classList.add("moderate");
  } else {
    forecast.classList.remove("cold");
    forecast.classList.add("hot");
    forecast.classList.remove("moderate");
  }
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  loader.style.display = "block";
  const city = event.target["city"].value;
  await getWeather(city);
  loader.style.display = "none";
  form.reset();
});
