import "./style.css";

const API_KEY = "VXG7GBWM2JRTWQAQLNZTR3P8G";

const form = document.querySelector("form");

async function getWeather(city) {
  const unitGroup = "metric";
  const include = "days,hours,current";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unitGroup}&include=${include}&key=${API_KEY}&lang=fr`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    console.log(parseJson(json));
  } catch (err) {
    return console.log(err);
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

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = event.target["city"].value;
  getWeather(city);
  form.reset();
});
