package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoApiService interface {
	getAllContentByType(collection *mongo.Collection) ([]Content, error)
	getContentByMongoId(collection *mongo.Collection, mongoId string) (Content, error)
	getContentByElementId(collection *mongo.Collection, id string) (Content, error)
	getContentByElementIdAndDate(collection *mongo.Collection, id string, date string) (Content, error)

	//return generated id or nil
	insertManyContent(collection *mongo.Collection, contents *[]Content) ([]interface{}, error)
	insertOneContent(collection *mongo.Collection, content *Content) (primitive.ObjectID, error)

	//return updated id or upserted id
	upsertByType(collection *mongo.Collection, id primitive.ObjectID, content *Content) (primitive.ObjectID, error)
	updateById(collection *mongo.Collection, id primitive.ObjectID, content *Content) (primitive.ObjectID, error)
	upsertSingleContent(collection *mongo.Collection, body Content) Content

	deleteOneContent(collection *mongo.Collection, contentId string) (succeed bool, err error)
	deleteAllContent(collection *mongo.Collection, ids []string)
}
