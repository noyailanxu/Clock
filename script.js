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

async function fetchDepartures(stopName, elementId) {
  const url = `https://v5.transport.rest/locations?query=${encodeURIComponent(stopName)}&results=1`;

  try {
    const locRes = await fetch(url);
    const locData = await locRes.json();

    if (!locData[0]?.id) {
      document.getElementById(elementId).textContent = "No data";
      return;
    }

    const stopId = locData[0].id;

    const depRes = await fetch(
      `https://v5.transport.rest/stops/${stopId}/departures?duration=20`
    );
    const depData = await depRes.json();

    let byDirection = {};

    depData.departures.forEach(dep => {
      if (!dep.direction || dep.line?.product !== "subway") return;

      if (!byDirection[dep.direction]) {
        byDirection[dep.direction] = [];
      }

      if (byDirection[dep.direction].length < 2) {
        byDirection[dep.direction].push(dep.when);
      }
    });

    const now = new Date();
    let output = [];

    for (const dir in byDirection) {
      const mins = byDirection[dir].map(t =>
        Math.max(0, Math.round((new Date(t) - now) / 60000)) + " min"
      );
      output.push(`→ ${dir} · ${mins.join(", ")}`);
    }

    document.getElementById(elementId).innerHTML =
      output.length ? output.join("<br>") : "No data";

  } catch {
    document.getElementById(elementId).textContent = "No data";
  }
}

function updateTrains() {
  fetchDepartures("Meidlinger Hauptstraße U", "u4-trains");
  fetchDepartures("Niederhofstraße U", "u6-trains");
}

updateTrains();
setInterval(updateTrains, 30 * 1000);
