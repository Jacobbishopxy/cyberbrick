package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"server-go/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func setGetServiceHeader(w http.ResponseWriter) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func getCollectionFromQuery(r *http.Request) *mongo.Collection {
	params := r.URL.Query()
	Type, hasType := params["type"]
	// var collection *mongo.Collection
	if hasType {
		return getCollectionByType(Type[0])
	} else {
		return nil
	}
}

func getCollectionByType(collectionType string) *mongo.Collection {
	return collections[collectionType]
}

func insertOrUpdateSingleContent(collection *mongo.Collection, body models.Content) models.Content {
	var returnContent models.Content
	//haven't save to mongodb
	if body.Id == primitive.NilObjectID {
		// returnContent[i] = ct
		id, err := api.insertOneContent(collection, &body)
		//insert error, skip
		if err != nil {
			log.Println(err)
		} else {
			body.Id = id
			returnContent = body
		}

	} else {
		//already saved to mongodb, update the content
		// returnContent[i] = ct
		id, err := api.updateById(collection, body.Id, &body)
		//update error, skil
		if err != nil {
			log.Println(err)
		} else {
			body.Id = id
			returnContent = body
		}
	}
	return returnContent

}

func parseRequestContent(r *http.Request) (models.Content, error) {
	var body models.Content
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Println(err)
		return models.Content{}, err
	}
	return body, nil
}

func parseRequestContentList(r *http.Request) ([]models.Content, error) {
	var body []models.Content
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return body, nil
}

func parseRequestBody(r *http.Request) models.Request {
	var body models.Request
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Fatal(err)
	}
	return body
}

// func parseRequestChunkBody(r *http.Request) models.RequestChunk {
// 	var body models.RequestChunk
// 	err := json.NewDecoder(r.Body).Decode(&body)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	return body
// }
func contentValidation(content *models.Content) bool {
	if content.Date == 0 || content.ElementId == "" {
		fmt.Println("date or elementId is undefined!")
		return false
	}
	return true
}
