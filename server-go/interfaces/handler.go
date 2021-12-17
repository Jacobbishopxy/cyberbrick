package interfaces

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"server-go/application"
	"server-go/domain"

	"go.mongodb.org/mongo-driver/mongo"
)

// create connection with mongo db
// func init() {
// 	createDBInstance()
// 	api = new(MongoApi)
// }

type MongoApiHandler struct {
	mongoApp    application.MongoApi
	collections map[string]*mongo.Collection
}

func NewMongoApiHandler(mogoApi application.MongoApi, collections map[string]*mongo.Collection) *MongoApiHandler {
	return &MongoApiHandler{mogoApi, collections}
}

// GetAllContent get all the Content by type route
func (mh *MongoApiHandler) GetAllContentByType(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	Type, ok := params["type"]
	if ok {
		collection := mh.getCollectionByType(Type[0])
		// collection := getCollectionByType(body.Type)
		payload, _ := mh.mongoApp.GetAllContentByType(collection)
		json.NewEncoder(w).Encode(payload)
	}

}

func (mh *MongoApiHandler) GetContent(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	Type, hasType := params["type"]
	id, hasId := params["id"]
	elementId, hasEleId := params["elementId"]
	date, hasDate := params["date"]
	var collection *mongo.Collection
	var singlePayload domain.Content
	if hasType {
		collection = mh.getCollectionByType(Type[0])
	}
	if hasId {
		singlePayload, _ = mh.mongoApp.GetContentByMongoId(collection, id[0])
		json.NewEncoder(w).Encode(singlePayload)
	} else if hasEleId {
		//get by elementId
		//get by id and date
		if hasDate {
			singlePayload, _ = mh.mongoApp.GetContentByElementIdAndDate(collection, elementId[0], date[0])
		} else {
			singlePayload, _ = mh.mongoApp.GetLatestContentByElementId(collection, elementId[0])
		}
		json.NewEncoder(w).Encode(singlePayload)
		//get by Type
	} else {
		payload, _ := mh.mongoApp.GetAllContentByType(collection)
		json.NewEncoder(w).Encode(payload)
	}

	// collection := getCollectionByType(params["type"])

}

func (mh *MongoApiHandler) CreateOrUpdateContent(w http.ResponseWriter, r *http.Request) {
	collection := mh.getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		// json.NewEncoder(w).Encode(errors.New("need query of type"))
		http.Error(w, "need query of type", 500)
		return
	}
	body, err := parseRequestContent(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of domain.Content", 500)
		return
	}
	returnContent := mh.mongoApp.UpsertSingleContent(collection, body)
	json.NewEncoder(w).Encode(returnContent)

}

// CreateContent create Content route
func (mh *MongoApiHandler) CreateContent(w http.ResponseWriter, r *http.Request) {
	collection := mh.getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		json.NewEncoder(w).Encode(errors.New("need query of type"))
		return
	}
	body, err := parseRequestContent(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of domain.Content", 500)
		return
	}
	id, err := mh.mongoApp.InsertOneContent(collection, &body)
	if err != nil {
		json.NewEncoder(w).Encode(err)
	} else {
		json.NewEncoder(w).Encode(id)
	}
}

func (mh *MongoApiHandler) CreateMultipleContent(w http.ResponseWriter, r *http.Request) {
	collection := mh.getCollectionFromQuery(r)
	//check collection exist
	if collection == nil {
		json.NewEncoder(w).Encode(errors.New("need query of type"))
		return
	}
	body, err := parseRequestContentList(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of domain.Content", 500)
		return
	}
	ids, err := mh.mongoApp.InsertManyContent(collection, &body)
	if err != nil {
		json.NewEncoder(w).Encode(err)
	} else {
		json.NewEncoder(w).Encode(ids)
	}
}

func (mh *MongoApiHandler) UpdateContent(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	Type, hasType := params["type"]
	body, err := parseRequestContent(r)
	if err != nil {
		http.Error(w, "Parsing body error: need body in forms of domain.Content", 500)
		return
	}
	var collection *mongo.Collection
	if hasType {
		collection = mh.getCollectionByType(Type[0])
	} else {
		return
	}
	// fmt.Println(body)
	upsertId, _ := mh.mongoApp.UpdateById(collection, body.Id, &body)
	json.NewEncoder(w).Encode(upsertId)
}

// DeleteContent delete one Content route
func (mh *MongoApiHandler) DeleteContent(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	fmt.Println(params)
	Type, hasType := params["type"]
	id, hasId := params["id"]
	if hasType && hasId {
		collection := mh.getCollectionByType(Type[0])

		mh.mongoApp.DeleteOneContent(collection, id[0])
		json.NewEncoder(w).Encode(id)
	}
	// json.NewEncoder(w).Encode("Content not found")

}

// DeleteAllContent delete all Contents route
func (mh *MongoApiHandler) DeleteAllContent(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	Type, hasType := params["type"]
	id, hasId := params["id"]
	if hasType && hasId {
		collection := mh.getCollectionByType(Type[0])
		mh.mongoApp.DeleteAllContent(collection, id)
		// json.NewEncoder(w).Encode(count)
	}

	// json.NewEncoder(w).Encode("Content not found")
}
