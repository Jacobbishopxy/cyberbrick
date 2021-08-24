package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoApiService interface {
	//TODO: pagination
	GetAllContentByType(collection *mongo.Collection) ([]Content, error)
	GetContentByMongoId(collection *mongo.Collection, mongoId string) (Content, error)
	GetLatestContentByElementId(collection *mongo.Collection, id string) (Content, error)
	GetContentByElementIdAndDate(collection *mongo.Collection, id string, date string) (Content, error)

	//return generated id or nil
	InsertManyContent(collection *mongo.Collection, contents *[]Content) ([]interface{}, error)
	InsertOneContent(collection *mongo.Collection, content *Content) (primitive.ObjectID, error)

	//return updated id or upserted id
	UpsertByType(collection *mongo.Collection, id primitive.ObjectID, content *Content) (primitive.ObjectID, error)
	UpdateById(collection *mongo.Collection, id primitive.ObjectID, content *Content) (primitive.ObjectID, error)
	UpsertSingleContent(collection *mongo.Collection, body Content) Content

	DeleteOneContent(collection *mongo.Collection, contentId string) (succeed bool, err error)
	DeleteAllContent(collection *mongo.Collection, ids []string)
}
