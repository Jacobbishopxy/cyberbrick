package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"server-go/application"
	"server-go/interfaces"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const base = "../resources/"
const mongoConnEnv = "mongo.connection.env"
const devConnString = "DB_LOCALHOST_URL"
const prodConnString = "DB_URL"
const dbEnvName = "go.env"
const databaseName = "DB_NAME"
const collectionsList = "DB_COLLECTION_NAME"
const port = ":8040"

func main() {
	collections := createDBInstance()
	mongoApp := application.NewMongoApp()
	mongoHandler := interfaces.NewMongoApiHandler(*mongoApp, collections)
	r := mongoHandler.Router()

	fmt.Println("Starting server on the port" + port)
	log.Fatal(http.ListenAndServe(port, r))
}

func loadTheEnv(path string) {
	// load .env file
	err := godotenv.Load(path)

	if err != nil {
		log.Print(err)
		log.Fatalf("Error loading " + path + " file\n")
	}
}

func createDBInstance() (collections map[string]*mongo.Collection) {

	//load connection string file
	loadTheEnv(base + mongoConnEnv)
	// DB connection string
	connectionString := os.Getenv(devConnString)

	if len(os.Args) > 1 && os.Args[1] == "prod" {
		connectionString = os.Getenv(prodConnString)
	}

	loadTheEnv(base + dbEnvName)
	// Database Name
	dbName := os.Getenv(databaseName)
	// Collection name
	collNames := strings.Split(os.Getenv(collectionsList), ",")
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
	fmt.Println("Collection instances created!")
	return
}
