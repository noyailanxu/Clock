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
const CITY = "Vienna";

async function updateWeather() {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${WEATHER_API_KEY}`
  );
  const data = await res.json();

  const temp = Math.round(data.main.temp);
  const condition = data.weather[0].main;

  let emoji = "☀️";
  if (condition.includes("Cloud")) emoji = "⛅";
  if (condition.includes("Rain")) emoji = "🌧️";

  document.getElementById("weather").textContent =
    `${temp}°C ${emoji}`;
}

updateWeather();
setInterval(updateWeather, 10 * 60 * 1000);

