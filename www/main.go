package main

import (
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server, err := createServerSocket()

	if err != nil {
		log.Fatal(err)
		return
	}

	go server.Serve()
	defer server.Close()
	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.Handle("/socket.io", server)
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

	server.OnEvent("/", "cpu", func(s socketio.Conn, msg string) {})

	server.OnEvent("/", "ram", func(s socketio.Conn, msg string) {})

	server.OnDisconnect("/", func(s socketio.Conn, msg string) {})

	return server, nil
}
