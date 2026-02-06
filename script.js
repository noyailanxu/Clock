function updateClock() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  document.getElementById("clock").textContent = `${hours}:${minutes}`;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];

  document.getElementById("date").textContent =
    `${dayName} · ${month} ${date}`;
}

updateClock();
setInterval(updateClock, 1000);
const WEATHER_API_KEY = "b49ee6bc4e436d11f92da7b5a6702604";

// קואורדינטות של וינה
const LAT = 48.2082;
const LON = 16.3738;

async function updateWeather() {
  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&units=metric&exclude=minutely,hourly,alerts&appid=${WEATHER_API_KEY}`
  );
  const data = await res.json();

  const today = data.daily[0];

  const minTemp = Math.round(today.temp.min);
  const maxTemp = Math.round(today.temp.max);

  const condition = today.weather[0].main;

  let emoji = "☀️";
  if (condition === "Clouds") emoji = "☁️";
  if (condition === "Rain" || condition === "Drizzle") emoji = "🌧️";
  if (condition === "Snow") emoji = "❄️";

  document.getElementById("weather").textContent =
    `${minTemp}–${maxTemp}°C ${emoji}`;
}

updateWeather();
setInterval(updateWeather, 60 * 60 * 1000);

