const socket = io();

const graph = document.getElementById("graph");
const totalDiv = document.getElementById("total");
const usedDiv = document.getElementById("used");
const usedPercentDiv = document.getElementById("usedPercent");

Plotly.plot(
  graph,
  [
    {
      x: [new Date()],
      y: [0],
      mode: "lines+markers",
      name: "RAM consumida (MB)",
      marker: { color: "#80CAF6", size: 8 },
      line: { width: 4 },
    },
  ],
  {
    xaxis: {
      range: [0, 50],
    },
    yaxis: {
      title: "Uso de memoria (MB)",
      showticklabels: true,
      tickangle: 45,
      tickfont: {
        family: 'Old Standard TT, serif',
        size: 14,
        color: 'black'
      }
    },
  }
);

socket.on("ram-total", (total) => {
  totalDiv.innerText = total + " MB";
});

socket.on("ram-used", (ram) => {
  usedDiv.innerText = ram.used + " MB";
  usedPercentDiv.innerText = ram.usedPercent.toFixed(2) + " %";

  var time = new Date();

  var update = {
    x: [[time]],
    y: [[ram.used]]
  }

  var olderTime = time.setMinutes(time.getMinutes() - 1);
  var futureTime = time.setMinutes(time.getMinutes() + 1);

  var minuteView = {
    xaxis: {
      type: 'date',
      range: [olderTime, futureTime]
    }
  };

  Plotly.relayout(graph, minuteView);
  Plotly.extendTraces(graph, update, [0])
});

setTimeout(() => {
  socket.emit("ram-total");
}, 500);


setInterval(() => {
  socket.emit("ram-used");
}, 1000);

