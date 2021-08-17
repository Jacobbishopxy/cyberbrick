package middleware

import (
	"context"
	"log"
	"server-go/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//empty struct, use to implement interface
type MongoApi struct {
}

/*
Helper func to query database. Takes collection, filter and findOptions as param,
return an array of data
*/
func getContent(collection *mongo.Collection, filter interface{}, findOptions *options.FindOptions) ([]models.Content, error) {
	var results []models.Content
	cur, err := collection.Find(context.Background(), filter, findOptions)
	if err != nil {
		log.Println(err)
		return results, err
	}
	//iterate over your cursor and have it retrieve your data in batches
	for cur.Next(context.Background()) {
		var result models.Content
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
			return results, e
		}
		results = append(results, result)

	}
	if err := cur.Err(); err != nil {
		log.Println(err)
		return results, err
	}
	cur.Close(context.Background())
	return results, nil
}

// get all Content from the DB and return it
func (api *MongoApi) getAllContentByType(collection *mongo.Collection) ([]models.Content, error) {
	// findOptions := options.Find()
	return getContent(collection, bson.D{{}}, nil)
}

func (api *MongoApi) getContentByMongoId(collection *mongo.Collection, mongoId string) (models.Content, error) {
	id, _ := primitive.ObjectIDFromHex(mongoId)
	var result models.Content
	filter := bson.D{{Key: "_id", Value: id}}
	if err := collection.FindOne(context.Background(), filter).Decode(&result); err != nil {
		log.Println(err)
		return result, err
	}
	return result, nil
}
func (api *MongoApi) getContentByElementId(collection *mongo.Collection, id string) (models.Content, error) {
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "date", Value: -1}})
	findOptions.SetLimit(1)
	filter := bson.D{{Key: "elementId", Value: id}}
	result, err := getContent(collection, filter, findOptions)

	if len(result) > 0 {
		return result[0], nil
	}
	return models.Content{}, err
}

func (api *MongoApi) getContentByElementIdAndDate(collection *mongo.Collection, id string, date string) (models.Content, error) {
	var result models.Content
	// findOptions := options.Find()
	var filter = bson.D{{Key: "elementId", Value: id}}
	parse_time, err := time.Parse(time.RFC3339, date)
	// fmt.Printf("parse_time is :%s", parse_time)
	if err != nil {
		log.Println(err)
		return result, err
	} else {
		filter = append(filter, bson.E{Key: "date", Value: parse_time})
	}
	// fmt.Println("filter:", filter)
	if err := collection.FindOne(context.Background(), filter).Decode(&result); err != nil {
		log.Println(err)
		return result, err
	}
	return result, nil
}
