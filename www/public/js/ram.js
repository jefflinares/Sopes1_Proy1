const socket = io();

const graph = document.getElementById("graph");

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
      range: [0, 10]
    },
    yaxis: {
      title: "Memoria RAM (MB)",
    },
  }
);

socket.on("ram-total", (total) => {
  console.log(total);
  Plotly.relayout(graph, {
    yaxis: {
      range: [0, total]
    }
  });  
});

socket.on("ram-used", (ram) => {
  Plotly.extendTraces(
    graph,
    {
      y: [[ram.used]],
    },
    [0]
  );

});

socket.emit("ram-total");

var cnt = 0;

setInterval(() => {
  socket.emit("ram-used");
  cnt++;
  if (cnt > 10) {
    Plotly.relayout(graph, {
      xaxis: {
        range: [cnt - 10, cnt]
      }
    });
  }
}, 1000);
