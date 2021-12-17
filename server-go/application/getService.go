package application

import (
	"context"
	"log"
	"server-go/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// get all Content from the DB and return it
func (api *MongoApi) GetAllContentByType(collection *mongo.Collection) ([]domain.Content, error) {
	// findOptions := options.Find()
	return getContent(collection, bson.D{{}}, nil)
}

func (api *MongoApi) GetContentByMongoId(collection *mongo.Collection, mongoId string) (domain.Content, error) {
	id, _ := primitive.ObjectIDFromHex(mongoId)
	if id == primitive.NilObjectID {
		log.Println("Id is nil objectId")
		return domain.Content{}, nil
	}
	var result domain.Content
	filter := bson.D{{Key: idKey, Value: id}}
	if err := collection.FindOne(context.Background(), filter).Decode(&result); err != nil {
		log.Println(err)
		return domain.Content{}, err
	}
	return result, nil
}

func (api *MongoApi) GetLatestContentByElementId(collection *mongo.Collection, id string) (domain.Content, error) {
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: date, Value: -1}})
	findOptions.SetLimit(1)
	filter := bson.D{{Key: elementId, Value: id}}
	result, err := getContent(collection, filter, findOptions)

	if len(result) > 0 {
		return result[0], nil
	}
	return domain.Content{}, err
}

func (api *MongoApi) GetContentByElementIdAndDate(collection *mongo.Collection, id string, date string) (domain.Content, error) {
	var result domain.Content
	// findOptions := options.Find()
	var filter = bson.D{{Key: elementId, Value: id}}
	// parse_time, err := time.Parse(time.RFC3339, date)
	parse_time, err := time.Parse(PgTimestampFormat, date)
	// fmt.Printf("parse_time is :%s", parse_time)
	if err != nil {
		log.Println(err)
		return result, err
	} else {
		filter = append(filter, bson.E{Key: date, Value: parse_time})
	}
	// fmt.Println("filter:", filter)
	if err := collection.FindOne(context.Background(), filter).Decode(&result); err != nil {
		log.Println(err)
		return domain.Content{}, err
	}
	return result, nil
}
