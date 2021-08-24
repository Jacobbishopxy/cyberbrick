package interfaces

import (
	"encoding/json"
	"log"
	"net/http"
	"server-go/domain"

	"go.mongodb.org/mongo-driver/mongo"
)

func (mh *MongoApiHandler) getCollectionFromQuery(r *http.Request) *mongo.Collection {
	params := r.URL.Query()
	Type, hasType := params["type"]
	// var collection *mongo.Collection
	if hasType {
		return mh.getCollectionByType(Type[0])
	} else {
		return nil
	}
}

func (mh *MongoApiHandler) getCollectionByType(collectionType string) *mongo.Collection {
	return mh.collections[collectionType]
}

func parseRequestContent(r *http.Request) (domain.Content, error) {
	var body domain.Content
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Println(err)
		return domain.Content{}, err
	}
	return body, nil
}

func parseRequestContentList(r *http.Request) ([]domain.Content, error) {
	var body []domain.Content
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return body, nil
}

//@depreciated
// func parseRequestBody(r *http.Request) domain.Request {
// 	var body domain.Request
// 	err := json.NewDecoder(r.Body).Decode(&body)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	return body
// }
