const socket = io();

socket.emit("proc");
var tree = []
var accodionId = 1;
var collapseId = 1;
socket.on("proc", (procInfo) => {
  
  try {
    //console.log(procInfo);
    var j = "{\n";
    j += '"Processes":[\n';
    var i = 0;
    //CREAR TABLA Y AÑADIR INFO DE LOS PROCESOS
    var div = document.getElementById("tablaProcesos");
    div.innerHTML = "";
    var table_body = createTable(div) ;
    for(let i = 0; i < procInfo.Processes.length; i ++)
    {
      if(i > 0){
        j+=",\n";
      }  
       
       j += getJson(procInfo.Processes[i], "\t");
       

       addProcInfo(procInfo.Processes[i], 0, table_body);


    }

    j += "\t]\n}";

    //console.log(j);
    //console.log("{"+JSON.stringify(procInfo.Processes)+"}");
    
    //jTable(j);
  }catch (exception) {
    console.log(exception);
  }

});





function createTh(txt)
{
  var th = document.createElement('th');
  th.scope = "col";
  th.innerHTML = txt;
  return th;
}

function createTr(class_name, id, collap)
{
  var tr = document.createElement("tr");
  tr.setAttribute("class", class_name);
  tr.setAttribute("id",id);
  tr.setAttribute("data-toggle", "collapse")
  tr.setAttribute("data-parent", "#"+id);
  tr.setAttribute("href", "#"+collap);
  return tr;
}

function createTd(class_name, txt)
{
  var td = document.createElement('td');
  td.setAttribute("class",class_name);
  td.innerHTML = txt;
  return td;
}

function createDiv(class_name, id)
{
  var div = document.createElement("div");
  div.setAttribute("id",id);
  div.setAttribute("class",class_name);
  return div;
}

function addProcInfo(proc,level, tbody)
{
  var tr = createTr("accordion-toggle collapsed","accordion"+accodionId++, "collapse"+collapseId++);
  var hasChilds = false;
  if(proc.Hijos !== undefined && proc.Hijos.length > 0){
    tr.append(createTd("expand-button", ""))
    hasChilds = true;
  }
  tr.append(createTd("expand-button", proc.Pid));
  tr.append(createTd("expand-button", proc.Name));
  tr.append(createTd("expand-button", proc.User));
  tr.append(createTd("expand-button", proc.Memory));
  tr.append(createTd("expand-button", proc.Status));
  tr.append(createTd("expand-button", proc.PPid));
  tbody.append(tr);

  
  if(hasChilds)
  {
    
    tr = createTr("hide-table-padding");
    for(let i = 0; i<level;i++){
      tr.append(createTd("",""));
    }
    var td_div = createTd();
    td_div.setAttribute("colspan","12");

    var divChilds = createDiv("collapse in p-3", collapseId);
    
    var tableChilds = createTable(divChilds);

    

    //RECORRER CADA PROC HIJO Y PEGARLE LA INFO EN LA NUEVA TABLA
/*
    for(let i = 0; i < proc.Hijos.length; i++)
    {
      addProcInfo(proc.Hijos[i], level+1,tableChilds);
    }
    */
    td_div.append(divChilds);
    tr.append(td_div);
    tbody.append(tr);
  }
}

function createTable(div)
{
  var table = document.createElement("table");
  table.className = "table"
  var thead = document.createElement("thead");
  table.append(thead);
  thead.append(createTh("PID"));
  thead.append(createTh("NAME"));
  thead.append(createTh("USER"));
  thead.append(createTh("MEMORY"));
  thead.append(createTh("STATUS"));
  thead.append(createTh("PPID"));

  var tbody = document.createElement("tbody");
  div.append(table);
  return tbody;

}






function getJson(proc, tab ) 
{
 
  tab = tab + "\t";
  let j = tab+"{\n";
  j += tab+'"Pid":"'+proc.Pid+'",\n';
  j += tab+'"Name":"'+proc.Name+'",\n';
  j += tab+'"User":"'+proc.User+'",\n';
  j += tab+'"Status":"'+proc.Status+'",\n';
  j += tab+'"Memory":"'+proc.Memory+'",\n';
  j += tab+'"PPid":"'+proc.PPid+'"';
  
  if(proc.Hijos !== undefined && proc.Hijos.length>0)
  {
    j += ',\n'+tab+'"Hijos":[\n';

    for(let i = 0; i<proc.Hijos.length; i++){
      if(i > 0)
      {
        j += tab+ ",\n";
      }
      j += getJson(proc.Hijos[i], tab);
    }
    j += tab+"]\n";
  }
  return j + "}\n";
}

//console.log(tree);
/*
function cargarTreeView() {    
  alert('cargara treeview');
  try{
    var $TreeV = $('#treeview').treeview({
      data: tree
    });
  }catch(ex)
  {
    console.log(ex);
  }
  
}
*/




setInterval(() => {
  socket.emit("proc");
  
}, 120000);




/*

function jTable(obj) {
  document.getElementById('output').innerHTML = ""
  var objLen; // variable placeholder to store the number of records
  try {
      obj = JSON.parse(obj);
      var table = $("<table>").addClass("table table-striped table-hover table-bordered table-condensed table-responsive").attr("id", "myTable");
      var thead = $("<thead>");
      var row = $("<tr>");
      $(table).append($(row).append($("<th>").addClass("info").append("#")));
      //check to see if obj is in array format or basic JSON
      if (obj[0] != undefined) {
          for (var key in obj[0]) {
              $(table).append($(thead).append($(row).append($("<th>").addClass("info").append(key))));
          }
          objLen = obj.length;
      } else {
          for (var key in obj) {
              $(table).append($(thead).append($(row).append($("<th>").addClass("info").append(key))));
          }
          objLen = 1; //always will be one because it's just one JSON item
      }

      $(obj).each(function(i, e) {
          var innerRow = $("<tr>");
          
          $(innerRow).append($("<td>").append(i + 1));
          var pid = -1;
          for (var key in e) {
            if(key.toString() === "Pid"){
              pid = e[key];
            }
            
            $(innerRow).append($("<td>").append(outputFormat(e[key], pid)));//.append(e[key]));
          }
         

          $(table).append($(innerRow));
      });
      $("#output").append($(table));

      //    console.log(obj.length);
      $("#rowCount").text("Number of records:" + objLen).show();

  } catch (err) {
      $("#output").append("<h3 class='text-danger container'>Could not process request, please check your input and try again!</h3>");
      $("#output").append("<h5 class='bg-warning container'><strong>Error Logged: </strong>" + err + "</h5>");
  }
}

function killprocess(pid){
  alert('procesos matado: '+pid);
}

function outputFormat(o, pid){
  var btn = document.createElement("BUTTON");
  btn.innerHTML = "KILL PROC: "+pid;
  btn.id = "btn_"+pid
  btn.onclick = function() { killprocess(name); }
  
  if(typeof(o) == 'object'){
      var str = '';
      str += '<button id="btn_'+pid+'" onclick="killprocess('+pid+')">Kill</button>';
      for(p in o){
          str += '<details>';
          str += '<summary>' + p + '</summary>';
          str += '<p style="padding-left: 15px">' + outputFormat(o[p]) + '</p>';
          str += '</details>';
          
      }
      //console.log(str);
      return str;
  } else { return o; }
}
*/