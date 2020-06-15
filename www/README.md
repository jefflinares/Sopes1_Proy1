# Aplicacion web

# Carpeta Public
    Contiene los archivos que utilizará el cliente, en ella se encuentra los archivos *.html 
    y tambien otras 2 carpetas
# carpeta css
    Contiene los archivos css, que utilizaran nuestros archivos *.html
# carpeta js
    contiene los archivos js, que utilizaran nuestros archivos *.html

# carpeta www

# Archivos *.go

# commons_io.go

Archivo Que se contiene metodos para leer un archivo y retornar un arreglo de strings


Metodo readLines: lee el contenido del archivo y los divide por una nueva línea.

```golang
func readLines(filename string) ([]string, error) {
```

Metodo readLinesOffsetN: lee el contenido del archivo y los divide por una nueva línea.
Offset, indica en qué número de línea comenzar.
El contador determina el número de líneas para leer (comenzando desde el desplazamiento):
   n >= 0: a lo sumo n líneas
   n < 0: archivo completo

```golang
func readLinesOffsetN(filename string, offset uint, n int) ([]string, error) {
```

# Archivo main.go

Este archivo contiene la creacion del socket que comunicara al cliente con el servidor, define las rutas con las cuales se obtienen la informacion del cpu, ram y procesos.

Struct Cpu: es utilizado para retornar la informacion al cliente, sus atributos representan el uso del cpu actualmente, y el porcentaje de uso, estos se retornan al cliente como un Json.

```golang
type Cpu struct {
	Used        int    `json:"Used"`
	UsedPercent string `json:"UsedPercent"`
}
```

Funcion main: metodo principal que es la que inicia el flujo de la aplicación, en ella se
instancia el socket con una llamada a otra funcion, y se establece un hilo para correr el
servidor para mantener escuchando las peticiones del cliente.

```golang
func main() {
```

Metodo createServerSocket: devuelve el puntero del servidor creado, y un posible error,
instancia el socket y define sus rutas mediante el metodo socket.OnEvent("/",(ruta))

```golang
func createServerSocket() (*socketio.Server, error) {

    //Metodo que establece la conexion con el cliente, recibe el socket que recibio la peticion
    server.OnConnect("/", func(s socketio.Conn) error {


    //Metodo que define la ruta con la cual se recibe la peticion desde el cliente, recibe el
    //socket que recibio la peticion
    server.OnEvent("/", nombre_peticion, func(s socketio.Conn, msg string) {
    
    
    //envia al cliente en esa ruta, la informacion que necesitemos en este caso enviamos json.
    s.Emit(nombre_peticion, json)

    //Metodo del socket para desconectarse del cliente, no ejecuta nada
    server.OnDisconnect("/", func(s socketio.Conn, msg string) {})
```


# Archivo process.go
 Este archivo se utiliza para leer la informacion de los procesos del servidor y desplegarse
 en el cliente, utiliza librerias para leer archivo.



```golang

//Esta estructura definira la informacion que se leera de cada proceso (id, nombre, usuario que corre el proceso, el estado( durmiendo, corriendo, zombie, etc), la memoria que utiliza, el id_padre, y los hijos de este proceso), y el formato para 
//transformarse en json para retornar al cliente.

type Proc struct {
	Pid    string  `json:"Pid,omitempty"`
	Name   string  `json:"Name,omitempty"`
	User   string  `json:"User,omitempty"`
	Status string  `json:"Status,omitempty"`
	Memory string  `json:"Memory,omitempty"`
	PPid   string  `json:"PPid,omitempty"`
	Hijos  []*Proc `json:"Hijos,omitempty"`
}

//ProcsInfo estrucutra que contiene atributos para mostrar informacion en el cliente
// (total de procesos, procesos corriendo, procesos durmiendo, procesos detenidos, 
//  procesos zombie, y un arreglo de los procesos) 

type ProcsInfo struct {
	No_Procs     int     `json:"No_Procs"`
	No_Procs_Run int     `json:"No_Procs_Run"`
	No_Procs_Slp int     `json:"No_Procs_Slp"`
	No_Procs_Stp int     `json:"No_Procs_Stp"`
	No_Procs_Zmb int     `json:"No_Procs_Zmb"`
	Processes    []*Proc `json:"Processes,omitempty"`
}


```


Funcion getInfoProcs: esta funcion retorna el struct que contiene toda la informacion al 
cliente, va leyendo todas las carpetas dentro del directorio /proc y las que su nombre es
un numero son definidas para un proceso, dentro de carpeta leemos un archivo llamado status
en el contiene toda la informacion del proceso que necesitamos, para mas informacion acerca
de la estrucutura de archivos de estas carpetas visite: https://man7.org/linux/man-pages/man5/proc.5.html 

```golang
func getInfoProcs() *ProcsInfo {
```

Método seeTreeProcess: recibe un proceso y una identacion y lo unico que realiza es que
imprime su información, y si el proceso cuenta con hijos se vuelve a llamar por cada hijo.


```golang
func seeTreeProcess(proc *Proc, tab string) {
```

Método addHijo: Recibe la lista de todos los procesos leido, y recibe el proceso hijo, 
busca en todos los procesos el proceso padre y se lo añade al hijo.


```golang
func addHijo(procs []*Proc, child_proc *Proc) {
```

# archivo ram.go

Este archivo obtiene de la memoria ram


Struct RAM: esta estructura contiene atributos necesarios para retornar la informacion al 
cliente sobre el estado de la memoria ram, (el total en Mb, el uso, el porcentaje de uso, 
cuanta memoria libre hay, etc)

```golang

type RAM struct {
	Total       uint64  `json:"total"`
	Used        uint64  `json:"used"`
	UsedPercent float64 `json:"usedPercent"`
	Free        uint64  `json:"free"`
	Available   uint64  `json:"available"`
	Buffers     uint64  `json:"buffers"`
	Cached      uint64  `json:"cached"`
}

```


Funcion virtualMemory: funcion propia de la estructura ram y se encarga de llenar y retornar
la informacion de la misma, lee el archivo /proc/meminfo para ello.

```golang

func (ram *RAM) virtualMemory() error {

```


Funcion getTotalRAM: retorna el total de memoria ram del servidor en Mb

```golang
func getTotalRAM() (uint64, error) {
```