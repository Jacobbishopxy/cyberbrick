package application

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// delete one Content from the DB, delete by ID
func (api *MongoApi) DeleteOneContent(collection *mongo.Collection, contentId string) (succeed bool, err error) {
	// fmt.Println(contentId)
	id, _ := primitive.ObjectIDFromHex(contentId)
	filter := bson.M{idKey: id}
	var d *mongo.DeleteResult
	d, err = collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
	if d.DeletedCount > 0 {
		succeed = true
	}
	fmt.Println("Deleted Document", d.DeletedCount)
	return
}

// delete all the Contents from the DB
func (api *MongoApi) DeleteAllContent(collection *mongo.Collection, ids []string) {
	for i := 0; i < len(ids); i++ {
		api.DeleteOneContent(collection, ids[i])
	}

	// d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// fmt.Println("Deleted Document", d.DeletedCount)
	// return d.DeletedCount
}
