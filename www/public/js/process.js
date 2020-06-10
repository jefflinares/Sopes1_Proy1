const socket = io();

socket.emit("proc");

socket.on("proc", (procInfo) => {
    console.log(SON.stringify(procInfo))
});

 