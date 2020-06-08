const socket = io();

const graph = document.getElementById("graph");
const totalDiv = document.getElementById("total");
const usedDiv = document.getElementById("used");
const usedPercentDiv = document.getElementById("usedPercent");

Plotly.plot(
  graph,
  [
    {
      y: [0],
      mode: "lines+markers",
      name: "RAM consumida (MB)",
      marker: { color: "orange", size: 8 },
      line: { width: 4 },
    },
  ],
  {
    xaxis: {
      title: "Uso de memoria",
      range: [0, 50]
    },
    yaxis: {
      title: "Memoria RAM (MB)",
    },
  }
);

socket.on("ram-total", (total) => {
  totalDiv.innerText = total + " MB"; 
});

socket.on("ram-used", (ram) => {
  usedDiv.innerText = ram.used + " MB";
  usedPercentDiv.innerText = ram.usedPercent + " %";

  Plotly.extendTraces(
    graph,
    {
      y: [[ram.used]],
    },
    [0]
  );
});

setTimeout(() => {
  socket.emit("ram-total");
}, 500);

var cnt = 0;

setInterval(() => {
  socket.emit("ram-used");
  cnt++;
  if (cnt > 50) {
    Plotly.relayout(graph, {
      xaxis: {
        range: [cnt - 50, cnt]
      }
    });
  }
}, 1000);

