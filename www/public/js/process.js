const socket = io();

const divTablaProcesos = document.getElementById("tablaProcesos");

let accodionId = 1;
let collapseId = 1;

socket.on("proc", (procInfo) => {
  try {
    divTablaProcesos.innerHTML = "";
    divTablaProcesos.appendChild(createTable(procInfo.Processes));
  } catch (error) {
    console.log(error);
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
  thead.appendChild(createTh("MEMORY"));
  thead.appendChild(createTh("STATUS"));
  thead.appendChild(createTh("PPID"));
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
  th.innerHTML = txt;
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
  tr.appendChild(createTd(proc.Memory, ""));
  tr.appendChild(createTd(proc.Status, ""));
  tr.appendChild(createTd(proc.PPid, ""));
  return tr;
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

setInterval(() => {
  socket.emit("proc");
}, 120000);

socket.emit("proc");
