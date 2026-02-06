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

const CORS = "https://api.allorigins.win/raw?url=";

// rbl = מזהי רציפים (כיוון לכל רציף)
const U4_MEIDLINGER_RBL = [4403, 4404];
const U6_NIEDERHOF_RBL = [4431, 4432];

async function fetchStation(rblList, elementId) {
  let lines = [];

  for (const rbl of rblList) {
    try {
      const res = await fetch(
        CORS +
        encodeURIComponent(
          `https://www.wienerlinien.at/ogd_realtime/monitor?rbl=${rbl}`
        )
      );
      const data = await res.json();
      const monitor = data.data.monitors[0];

      if (!monitor) continue;

      const line = monitor.line.name;
      const direction = monitor.direction;
      const dep = monitor.departures.departure[0];

      if (dep) {
        const min = dep.departureTime.countdown;
        lines.push(`→ ${direction} · ${min} min`);
      }
    } catch (e) {
      // שקט – פשוט מדלגים
    }
  }

  document.getElementById(elementId).innerHTML =
    lines.length ? lines.join("<br>") : "No data";
}

function updateTrains() {
  fetchStation(U4_MEIDLINGER_RBL, "u4-trains");
  fetchStation(U6_NIEDERHOF_RBL, "u6-trains");
}

updateTrains();
setInterval(updateTrains, 30 * 1000);
