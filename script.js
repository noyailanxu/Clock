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
async function updateWeather() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=48.2082&longitude=16.3738&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=Europe/Vienna"
  );
  const data = await res.json();

  const minTemp = Math.round(data.daily.temperature_2m_min[0]);
  const maxTemp = Math.round(data.daily.temperature_2m_max[0]);
  const code = data.daily.weathercode[0];

  let emoji = "☀️";
  if ([1,2].includes(code)) emoji = "⛅";
  if ([3].includes(code)) emoji = "☁️";
  if ([51,53,55,61,63,65].includes(code)) emoji = "🌧️";
  if ([71,73,75].includes(code)) emoji = "❄️";

  document.getElementById("weather").textContent =
    `${minTemp}–${maxTemp}°C ${emoji}`;
}

updateWeather();
setInterval(updateWeather, 60 * 60 * 1000);

async function updateTrains() {
  const res = await fetch(
    "https://www.wienerlinien.at/ogd_realtime/monitor?stopId=4120"
  );
  const data = await res.json();

  const monitors = data.data.monitors;

  let lines = [];

  monitors.forEach(monitor => {
    const line = monitor.line.name;
    const direction = monitor.direction;
    const departures = monitor.departures.departure;

    if (departures.length > 0) {
      const minutes = departures[0].departureTime.countdown;
      lines.push(`${line} → ${direction} · ${minutes} min`);
    }
  });

  document.getElementById("trains").innerHTML =
    lines.slice(0, 4).join("<br>");
}

updateTrains();
setInterval(updateTrains, 30 * 1000);
