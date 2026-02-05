function updateTime() {
  const now = new Date();

  document.getElementById("time").innerText =
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  document.getElementById("date").innerText =
    now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
}

async function updateTransport() {
  const response = await fetch(
    "https://www.wienerlinien.at/ogd_realtime/monitor?rbl=4939&rbl=4612"
  );
  const json = await response.json();

  const lines = {
    U4: { Heiligenstadt: [], Hütteldorf: [] },
    U6: { Siebenhirten: [], Floridsdorf: [] }
  };

  json.data.monitors.forEach(monitor => {
    monitor.lines.forEach(line => {
      if (!lines[line.name]) return;

      const direction = line.towards;
      const times = line.departures.departure
        .slice(0, 3)
        .map(d => `${d.departureTime.countdown}’`);

      if (lines[line.name][direction]) {
        lines[line.name][direction] = times;
      }
    });
  });

  let output = "";
  output += "U4\n";
  output += `Heiligenstadt     ${lines.U4.Heiligenstadt.join(" | ")}\n`;
  output += `Hütteldorf        ${lines.U4.Hütteldorf.join(" | ")}\n\n`;
  output += "U6\n";
  output += `Siebenhirten      ${lines.U6.Siebenhirten.join(" | ")}\n`;
  output += `Floridsdorf       ${lines.U6.Floridsdorf.join(" | ")}`;

  document.getElementById("transport").innerText = output;
}

updateTime();
updateTransport();
setInterval(updateTime, 1000);
setInterval(updateTransport, 30000);
