const socket = io();

const graph = document.getElementById("graph");

Plotly.plot(
  graph,
  [
    {
      y: [0],
      mode: "lines+markers",
      name: " (MB)",

      marker: { color: "orange", size: 8 },
      line: { width: 4 },
    },
  ],
  {
    xaxis: {
      title: "Lapso en segundos",
      range: [0, 10],
    },
    yaxis: {
      title: "Uso de CPU (%)",
    },
    title: " CPU",
  }
);

socket.on("cpu", (cpu) => {
  document.getElementById("cpu_used").innerHTML = cpu.Used + "%";
  Plotly.extendTraces(
    graph,
    {
      y: [[cpu.Used]],
      //title:"Uso de CPU (%)",
    },
    [0]
  );
});

socket.emit("cpu");

var cnt = 0;

setInterval(() => {
  socket.emit("cpu");

  cnt++;
  if (cnt > 10) {
    Plotly.relayout(graph, {
      xaxis: {
        range: [cnt - 10, cnt],
      },
    });
  }
  document.getElementById("segundos").innerHTML = cnt + " s.";
}, 1000);
