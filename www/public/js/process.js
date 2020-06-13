const socket = io();

const divTablaProcesos = document.getElementById("tablaProcesos");

const td1 = document.getElementById("td_1");
const td2 = document.getElementById("td_2");
const td3 = document.getElementById("td_3");
const td4 = document.getElementById("td_4");
const td5 = document.getElementById("td_5");

let accodionId = 1;
let collapseId = 1;

socket.on("proc", (procInfo) => {
  try {
    divTablaProcesos.innerHTML = "";
    divTablaProcesos.appendChild(createTable(procInfo.Processes));

    td1.innerHTML = procInfo.No_Procs_Run;
    td2.innerHTML = procInfo.No_Procs_Slp;
    td3.innerHTML = procInfo.No_Procs_Stp;
    td4.innerHTML = procInfo.No_Procs_Zmb;
    td5.innerHTML = procInfo.No_Procs;
  } catch (error) {
    console.log(error);
  }
});

socket.on("kill", (respuesta) => {
  if (respuesta === 1) {
    alert("Se ha detenido el proceso");
  } else {
    alert("Fallo la detencio del proceso: " + respuesta);
  }
});

/**
 *
 * @param {Array} processes
 */
function createTable(processes) {
  let table = document.createElement("table");
  table.className = "table";
  let thead = document.createElement("thead");
  thead.appendChild(createTd("#", ""));
  thead.appendChild(createTh("PID"));
  thead.appendChild(createTh("NAME"));
  thead.appendChild(createTh("USER"));
  thead.appendChild(createTh("MEMORY (%)"));
  thead.appendChild(createTh("STATUS"));
  thead.appendChild(createTh("PPID"));
  thead.appendChild(createTh("KILL"));
  let tbody = createBody(processes);
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

/**
 *
 * @param {string} txt
 */
function createTh(txt) {
  let th = document.createElement("th");
  th.scope = "col";
  th.append(txt);
  return th;
}

/**
 *
 * @param {string} txt
 * @param {string} className
 */
function createTd(txt, className) {
  let td = document.createElement("td");
  td.innerHTML = txt;
  td.className = className;
  return td;
}

/**
 *
 * @param {Array} processes
 */
function createBody(processes) {
  let tbody = document.createElement("tbody");
  processes.forEach((proc) => {
    tbody.appendChild(
      createTrHead("accordion" + accodionId++, "collapse" + collapseId++, proc)
    );
    if (proc.Hijos && proc.Hijos.length > 0)
      tbody.appendChild(
        createTrBody("collapse" + (collapseId - 1), proc.Hijos)
      );
  });

  return tbody;
}

/**
 *
 * @param {string} className
 * @param {string} id
 * @param {string} collap
 */
function createTrHead(id, collap, proc) {
  let tr = document.createElement("tr");
  tr.setAttribute("class", "accordion-toggle collapsed");
  tr.setAttribute("id", id);
  tr.setAttribute("data-toggle", "collapse");
  tr.setAttribute("data-parent", "#" + id);
  tr.setAttribute("href", "#" + collap);
  let hasChilds = proc.Hijos && proc.Hijos.length > 0;
  if (hasChilds) tr.appendChild(createTd("", "expand-button"));
  else tr.appendChild(createTd("", ""));
  tr.appendChild(createTd(proc.Pid, ""));
  tr.appendChild(createTd(proc.Name, ""));
  tr.appendChild(createTd(proc.User, ""));
  tr.appendChild(
    createTd(proc.Memory !== undefined ? proc.Memory + "%" : 0 + "%", "")
  );
  tr.appendChild(createTd(proc.Status, ""));
  tr.appendChild(createTd(proc.PPid, ""));
  var td_button = createTd("", "");
  td_button.appendChild(
    createBtn("btn btn-danger", "Kill", proc.Pid, proc.Name)
  );
  tr.appendChild(td_button);
  return tr;
}

/**
 * @param {string} class_name
 * @param {string} text
 * @param {string} pid
 * @param {string} proceso
 *
 */
function createBtn(class_name, text, pid, proceso) {
  var btn = document.createElement("button");
  btn.className = class_name;
  btn.innerHTML = text;
  btn.id = "btn_" + pid;
  btn.onclick = function () {
    killProc(pid, proceso);
  };
  return btn;
}

function killProc(pid, proceso) {
  if (confirm("Desea matar el proceso " + proceso + " con el pid: " + pid)) {
    socket.emit("kill", pid);
  }
}

/**
 *
 * @param {string} collap
 * @param {Object} processes
 */
function createTrBody(collap, processes) {
  let tr = document.createElement("tr");
  tr.setAttribute("class", "hide-table-padding");
  tr.appendChild(document.createElement("td"));
  let td = document.createElement("td");
  td.colSpan = 4;
  let div = document.createElement("div");
  div.id = collap;
  div.className = "collapse in p-3";
  div.appendChild(createTable(processes));
  td.appendChild(div);
  tr.appendChild(td);
  return tr;
}

socket.emit("proc");

setInterval(() => {
  socket.emit("proc");
}, 20000);
