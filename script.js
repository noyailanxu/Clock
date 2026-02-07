/* ===== שעון ===== */
function updateClock() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");

  document.getElementById("time").textContent = `${h}:${m}`;

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  document.getElementById("date").textContent = dateStr;
}

updateClock();
setInterval(updateClock, 1000);


/* ===== מזג אוויר ===== */
async function updateWeather() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=48.2082&longitude=16.3738&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=Europe/Vienna"
  );
  const data = await res.json();

  const min = Math.round(data.daily.temperature_2m_min[0]);
  const max = Math.round(data.daily.temperature_2m_max[0]);
  const code = data.daily.weathercode[0];

  let emoji = "☀️";
  if ([1,2].includes(code)) emoji = "⛅";
  if (code === 3) emoji = "☁️";
  if ([51,53,55,61,63,65].includes(code)) emoji = "🌧️";
  if ([71,73,75].includes(code)) emoji = "❄️";

  document.getElementById("weather").textContent =
    `${min}–${max}°C ${emoji}`;
}

updateWeather();
setInterval(updateWeather, 60 * 60 * 1000);

/* ===== רכבות – Transport.rest ===== */
async function fetchDepartures(stopName, elementId) {
  try {
    const locRes = await fetch(
      `https://v5.transport.rest/locations?query=${encodeURIComponent(stopName)}&results=1`
    );
    const locData = await locRes.json();
    if (!locData[0]?.id) {
      document.getElementById(elementId).textContent = "";
      return;
    }

    const depRes = await fetch(
      `https://v5.transport.rest/stops/${locData[0].id}/departures?duration=20`
    );
    const depData = await depRes.json();

    const now = new Date();
    let out = [];

    depData.departures.forEach(d => {
      if (d.line?.product === "subway" && d.direction) {
        const departureTime = d.when || d.plannedWhen;
        if (departureTime) {
          const mins = Math.max(
            0,
            Math.round((new Date(departureTime) - now) / 60000)
          );
          if (out.length < 2) {
            out.push(`→ ${d.direction} · ${mins} min`);
          }
        }
      }
    });

    document.getElementById(elementId).innerHTML = out.join("<br>");
  } catch {
    document.getElementById(elementId).textContent = "";
  }
}

function updateTrains() {
  fetchDepartures("Meidlinger Hauptstraße U", "u4-trains");
  fetchDepartures("Niederhofstraße U", "u6-trains");
}

updateTrains();
setInterval(updateTrains, 30 * 1000);
