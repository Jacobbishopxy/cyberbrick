package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"server-go/models"
	"strings"

	"github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// collection object/instance
var collections map[string]*mongo.Collection
var collNames []string
var api MongoApiDomain

// create connection with mongo db
func init() {

	createDBInstance()
	api = new(MongoApi)
}
func loadTheEnv(path string) {
	// load .env file
	err := godotenv.Load(path)

	if err != nil {
		log.Print(err)
		log.Fatalf("Error loading " + path + " file\n")
	}
}

func createDBInstance() {
	base := "../resources/"
	//load connection string file
	loadTheEnv(base + "mongo.connection.env")
	// DB connection string
	connectionString := os.Getenv("DB_LOCALHOST_URL")

	if len(os.Args) > 1 && os.Args[1] == "prod" {
		connectionString = os.Getenv("DB_URL")
	}

	loadTheEnv(base + "go.env")
	// Database Name
	dbName := os.Getenv("DB_NAME")

	// Collection name
	collNames = strings.Split(os.Getenv("DB_COLLECTION_NAME"), ",")

	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Print(connectionString, dbName)
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	collections = make(map[string]*mongo.Collection, len(collNames))

	for i := 0; i < len(collNames); i++ {
		collections[collNames[i]] = client.Database(dbName).Collection(collNames[i])
	}
	// collection = client.Database(dbName).Collection(collName)

	fmt.Println("Collection instances created!")
}

// func getApiHelper (w http.ResponseWriter) *mongo.Collection {

// }
// GetAllContent get all the Content by type route
func GetAllContentByType(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	params := r.URL.Query()
	Type, ok := params["type"]
	if ok {
		collection := getCollectionByType(Type[0])
		// collection := getCollectionByType(body.Type)
		payload, _ := api.getAllContentByType(collection)
		json.NewEncoder(w).Encode(payload)
	}

}

func GetContent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := r.URL.Query()
	Type, hasType := params["type"]
	id, hasId := params["id"]
	elementId, hasEleId := params["elementId"]
	date, hasDate := params["date"]
	var collection *mongo.Collection
	var singlePayload models.Content
	if hasType {
		collection = getCollectionByType(Type[0])
	}
	if hasId {
		singlePayload, _ = api.getContentByMongoId(collection, id[0])
		json.NewEncoder(w).Encode(singlePayload)
	} else if hasEleId {
		//get by elementId
		//get by id and date
		if hasDate {
			singlePayload, _ = api.getContentByElementIdAndDate(collection, elementId[0], date[0])
		} else {
			singlePayload, _ = api.getContentByElementId(collection, elementId[0])
		}
		json.NewEncoder(w).Encode(singlePayload)
		//get by Type
	} else {
		payload, _ := api.getAllContentByType(collection)
		json.NewEncoder(w).Encode(payload)
	}

	// collection := getCollectionByType(params["type"])

}

func CreateOrUpdateContent(w http.ResponseWriter, r *http.Request) {
	// setGetServiceHeader(w)
	collection := getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		// json.NewEncoder(w).Encode(errors.New("need query of type"))
		http.Error(w, "need query of type", 500)
		return
	}
	body, err := parseRequestContent(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of models.Content", 500)
		return
	}
	returnContent := insertOrUpdateSingleContent(collection, body)
	json.NewEncoder(w).Encode(returnContent)

}

func CreateOrUpdateContentList(w http.ResponseWriter, r *http.Request) {
	setGetServiceHeader(w)
	collection := getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		// json.NewEncoder(w).Encode(errors.New("need query of type"))
		http.Error(w, "need query of type", 500)
		return
	}
	body, err := parseRequestContentList(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of []models.Content", 500)
		return
	}
	var returnContent []models.Content
	for _, ct := range body {
		res := insertOrUpdateSingleContent(collection, ct)
		returnContent = append(returnContent, res)

	}
	json.NewEncoder(w).Encode(returnContent)

}

// CreateContent create Content route
func CreateContent(w http.ResponseWriter, r *http.Request) {
	setGetServiceHeader(w)
	collection := getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		json.NewEncoder(w).Encode(errors.New("need query of type"))
		return
	}
	body, err := parseRequestContent(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of models.Content", 500)
		return
	}
	id, err := api.insertOneContent(collection, &body)
	if err != nil {
		json.NewEncoder(w).Encode(err)
	} else {
		json.NewEncoder(w).Encode(id)
	}
}

func CreateMultipleContent(w http.ResponseWriter, r *http.Request) {
	setGetServiceHeader(w)
	collection := getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		json.NewEncoder(w).Encode(errors.New("need query of type"))
		return
	}
	body, err := parseRequestContentList(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of models.Content", 500)
		return
	}
	ids, err := api.insertManyContent(collection, &body)
	if err != nil {
		json.NewEncoder(w).Encode(err)
	} else {
		json.NewEncoder(w).Encode(ids)
	}
}

func UpdateContent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	params := r.URL.Query()
	Type, hasType := params["type"]
	body, err := parseRequestContent(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of models.Content", 500)
		return
	}
	var collection *mongo.Collection
	if hasType {
		collection = getCollectionByType(Type[0])
	} else {
		return
	}
	// fmt.Println(body)
	upsertId, _ := api.updateById(collection, body.Id, &body)
	json.NewEncoder(w).Encode(upsertId)
}

// DeleteContent delete one Content route
func DeleteContent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := r.URL.Query()
	fmt.Println(params)
	Type, hasType := params["type"]
	id, hasId := params["id"]
	if hasType && hasId {
		collection := getCollectionByType(Type[0])

		api.deleteOneContent(collection, id[0])
		json.NewEncoder(w).Encode(id)
	}
	// json.NewEncoder(w).Encode("Content not found")

}

// DeleteAllContent delete all Contents route
func DeleteAllContent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	params := r.URL.Query()
	Type, hasType := params["type"]
	id, hasId := params["id"]
	if hasType && hasId {
		collection := getCollectionByType(Type[0])
		api.deleteAllContent(collection, id)
		// json.NewEncoder(w).Encode(count)
	}

	// json.NewEncoder(w).Encode("Content not found")

}
