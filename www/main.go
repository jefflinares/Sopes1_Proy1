package main

import (
	"encoding/json"
	"log"
	"fmt"
	"net/http"
	"github.com/shirou/gopsutil/cpu"
	socketio "github.com/googollee/go-socket.io"
)
type Cpu struct {
	Used int         `json:"Used"`
	UsedPercent string `json:"UsedPercent"`
}


func main() {
	server, err := createServerSocket()

	if err != nil {
		log.Fatal(err)
		return
	}

	go server.Serve()
	defer server.Close()



	http.Handle("/", http.FileServer(http.Dir("public")))
	http.Handle("/socket.io/", server)
	log.Println("Server on port 3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func createServerSocket() (*socketio.Server, error) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		return nil, err
	}

	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		log.Println("connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "cpu", func(s socketio.Conn, msg string) {
		  log.Println("CPU")
		  
		  v, _ := cpu.Percent(0, false)
		  //disk := DiskUsage("/")
		  //log.Println(v[0])
		  json_bytes, _ := json.Marshal(Cpu{Used: int(v[0]), 
			UsedPercent: fmt.Sprintf("%.4f", v[0])})
		  s.Emit("cpu", string(json_bytes))

		  log.Println(json_bytes)

	})

	server.OnEvent("/", "ram", func(s socketio.Conn, msg string) {})
	
	server.OnDisconnect("/", func(s socketio.Conn, msg string) {})

	return server, nil
}
