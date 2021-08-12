package main

import (
	"fmt"
	"log"
	"net/http"

	"server-go/router"
)

func main() {
	r := router.Router()
	// fs := http.FileServer(http.Dir("build"))
	// http.Handle("/", fs)
	fmt.Println("Starting server on the port 8089...")
	log.Fatal(http.ListenAndServe(":8089", r))
}
