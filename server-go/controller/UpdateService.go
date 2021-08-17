package controller

import (
	"context"
	"errors"
	"fmt"
	"log"
	"server-go/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
@return primitive.ObjectId if update/upsert succeeded
@return nil if param id is not defined
*/
func (api *MongoApi) updateById(collection *mongo.Collection, id primitive.ObjectID, content *models.Content) (primitive.ObjectID, error) {
	if contentValidation(content) {
		return api.upsertByType(collection, id, content)
	}
	return primitive.NilObjectID, errors.New("content missing element id or date")
}

/*
prereq: content must be validated by contentValidation(content)
*/
func (api *MongoApi) upsertByType(collection *mongo.Collection, id primitive.ObjectID, content *models.Content) (primitive.ObjectID, error) {
	var filter bson.D
	if id != primitive.NilObjectID {
		filter = bson.D{{Key: "_id", Value: id}}
	} else {
		filter = bson.D{{Key: "elementId", Value: content.ElementId},
			{Key: "date", Value: content.Date}}
	}
	update := bson.M{"$set": content}
	upsert := true
	opt := options.Update().SetUpsert(upsert)
	// update = append(update, bson.M{"$upsert", true})
	result, err := collection.UpdateOne(context.Background(), filter, update, opt)
	if err != nil {
		log.Println(err)
		return primitive.NilObjectID, err
	}
	upsertedId := id
	if result.UpsertedID != nil && result.UpsertedID != primitive.NilObjectID {
		upsertedId = result.UpsertedID.(primitive.ObjectID)
	}
	//if id is null but we've successfully updated, get id from mongodb and return
	if upsertedId == primitive.NilObjectID {
		findResult, _ := api.getContentByElementIdAndDate(collection, content.ElementId, content.Date.Time().Format(time.RFC3339))
		upsertedId = findResult.Id
	}
	fmt.Println("Upserted a Single Record by mongo ID", upsertedId)
	return upsertedId, nil
}
