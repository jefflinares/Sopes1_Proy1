const socket = io();

socket.emit("proc");

socket.on("proc", (procInfo) => {
  console.log(procInfo);
});
