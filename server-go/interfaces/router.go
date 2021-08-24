package interfaces

import (
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func (mh *MongoApiHandler) Router() *mux.Router {

	//create a new instance of the router using mux.NewRouter()
	router := mux.NewRouter()
	router.Use(Middleware)
	//GET method. In Methods the first parameter is Method in this case,
	//it is GET and second OPTIONS, this is to tackle cors .
	router.HandleFunc("/api/mongo", mh.GetContent).Methods("GET", "OPTIONS")

	router.HandleFunc("/api/mongo", mh.CreateOrUpdateContent).Methods("POST", "OPTIONS")

	// router.HandleFunc("/api/mongo/saveUpdate", mh.CreateOrUpdateContentList).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/mongo", mh.UpdateContent).Methods("PUT", "OPTIONS")

	router.HandleFunc("/api/mongo", mh.DeleteContent).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/mongo/many", mh.DeleteAllContent).Methods("DELETE", "OPTIONS")
	//Return the router instance. This router will be served in the main.go
	return router
}
