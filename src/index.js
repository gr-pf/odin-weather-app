import "./style.css";

const API_KEY = "VXG7GBWM2JRTWQAQLNZTR3P8G";

async function getWeather(city) {
  const unitGroup = "metric";
  const include = "days,hours,current";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unitGroup}&include=${include}&key=${API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  console.log(json);
}

getWeather("london");
