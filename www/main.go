package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	"github.com/shirou/gopsutil/mem"
)

type Ram struct {
	Used        uint64 `json:"used"`
	UsedPercent string `json:"usedPercent"`
}

func main() {
	server, err := createServerSocket()

	if err != nil {
		log.Fatal(err)
	}

	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./public")))
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

	server.OnEvent("/", "cpu", func(s socketio.Conn, msg string) {})

	server.OnEvent("/", "ram-used", func(s socketio.Conn, msg string) {
		v, _ := mem.VirtualMemory()
		ram := Ram{
			Used:        v.Used / 1024 / 1024,
			UsedPercent: fmt.Sprintf("%.4f", v.UsedPercent),
		}
		s.Emit("ram-used", ram)
	})

	server.OnEvent("/", "ram-total", func(s socketio.Conn, msg string) {
		v, _ := mem.VirtualMemory()
		s.Emit("ram-total", v.Total/1024/1024)
	})

	server.OnDisconnect("/", func(s socketio.Conn, msg string) {})

	return server, nil
}
