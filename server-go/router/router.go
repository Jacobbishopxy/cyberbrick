package router

import (
	"server-go/middleware"

	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	//create a new instance of the router using mux.NewRouter()
	router := mux.NewRouter()
	//GET method. In Methods the first parameter is Method in this case,
	//it is GET and second OPTIONS, this is to tackle cors .
	router.HandleFunc("/api/mongo", middleware.GetContent).Methods("GET", "OPTIONS")

	router.HandleFunc("/api/mongo", middleware.CreateOrUpdateContent).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/mongo/saveUpdate", middleware.CreateOrUpdateContentList).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/mongo", middleware.UpdateContent).Methods("PUT", "OPTIONS")

	router.HandleFunc("/api/mongo", middleware.DeleteContent).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/mongo/many", middleware.DeleteAllContent).Methods("DELETE", "OPTIONS")
	//Return the router instance. This router will be served in the main.go
	return router
}
