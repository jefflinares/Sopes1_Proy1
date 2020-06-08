package main

import (
	//"encoding/json"
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	"github.com/shirou/gopsutil/cpu"
)

type Cpu struct {
	Used        int    `json:"Used"`
	UsedPercent string `json:"UsedPercent"`
}

func main() {
	server, err := createServerSocket()

	if err != nil {
		log.Fatal(err)
	}

	go server.Serve()
	defer server.Close()

	http.Handle("/", http.FileServer(http.Dir("./public")))
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
		log.Println("A new user connected")
		return nil
	})

	server.OnEvent("/", "cpu", func(s socketio.Conn, msg string) {
		v, _ := cpu.Percent(0, false)
		cpu_ := Cpu{
			Used:        int(v[0]),
			UsedPercent: fmt.Sprintf("%.4f", v[0]),
		}
		s.Emit("cpu", cpu_)

	})

	server.OnEvent("/", "ram-used", func(s socketio.Conn, msg string) {
		ram := new(RAM)
		ram.virtualMemory()
		s.Emit("ram-used", ram)
	})

	server.OnEvent("/", "ram-total", func(s socketio.Conn, msg string) {
		total, err := getTotalRAM()
		if err != nil {
			log.Fatal(err)
		}
		s.Emit("ram-total", total)
	})

	server.OnDisconnect("/", func(s socketio.Conn, msg string) {})

	return server, nil
}
