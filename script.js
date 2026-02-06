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
const WEATHER_API_KEY = "240e10019eb2c278cb8dc78927310213";
const CITY = "Vienna";

async function updateWeather() {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${WEATHER_API_KEY}`
  );
  const data = await res.json();

  const today = new Date().getDate();

  const todaysData = data.list.filter(item =>
    new Date(item.dt_txt).getDate() === today
  );

  if (todaysData.length === 0) return;

  const temps = todaysData.map(item => item.main.temp);
  const minTemp = Math.round(Math.min(...temps));
  const maxTemp = Math.round(Math.max(...temps));

  const condition = todaysData[0].weather[0].main;

  let emoji = "☀️";
  if (condition === "Clouds") emoji = "☁️";
  if (condition === "Rain" || condition === "Drizzle") emoji = "🌧️";
  if (condition === "Snow") emoji = "❄️";

  document.getElementById("weather").textContent =
    `${minTemp}–${maxTemp}°C ${emoji}`;
}

updateWeather();
setInterval(updateWeather, 60 * 60 * 1000);

