package application

import (
	"context"
	"errors"
	"fmt"
	"log"
	"server-go/domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Insert multiple Content in the DB; return the generated objectId; nilObjectId if fails
func (api *MongoApi) InsertOneContent(collection *mongo.Collection, content *domain.Content) (primitive.ObjectID, error) {
	//only insert when content is validated
	if !contentValidation(content) {
		fmt.Println("date or elementId is undefined!")
		return primitive.NilObjectID, nil
	}
	insertResult, err := collection.InsertOne(context.Background(), content)
	if err != nil {
		log.Println(err)
		//insert error, try update
		// return api.UpdateById(collection, content.Id, content)
		return primitive.NilObjectID, err
	}
	fmt.Println("Inserted a single Record with id", insertResult.InsertedID)
	id, ok := insertResult.InsertedID.(primitive.ObjectID)
	if !ok {
		err := errors.New("cannot convert inserted id to primitive.objectid")
		return primitive.NilObjectID, err
	}
	return id, nil
}

//@depreciated
func (api *MongoApi) InsertManyContent(collection *mongo.Collection, contents *[]domain.Content) ([]interface{}, error) {
	//validation
	var ctSlice []interface{}
	for _, ct := range *contents {
		if !contentValidation(&ct) {
			fmt.Println("date or elementId is undefined!")
			continue
		}
		ctSlice = append(ctSlice, ct)
	}
	insertResult, err := collection.InsertMany(context.Background(), ctSlice)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	// ids := insertResult.InsertedIDs.([]primitive.ObjectID)
	return insertResult.InsertedIDs, nil
}
