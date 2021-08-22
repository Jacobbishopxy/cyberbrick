package application

import (
	"server-go/domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const elementId = "elementId"
const date = "date"
const idKey = "_id"

type MongoApi struct {
	// ri domain.MongoApiService
}

func NewMongoApp() *MongoApi {
	return &MongoApi{}
}

var _ MongoApiService = &MongoApi{}

type MongoApiService interface {
	GetAllContentByType(collection *mongo.Collection) ([]domain.Content, error)
	GetContentByMongoId(collection *mongo.Collection, mongoId string) (domain.Content, error)
	GetContentByElementId(collection *mongo.Collection, id string) (domain.Content, error)
	GetContentByElementIdAndDate(collection *mongo.Collection, id string, date string) (domain.Content, error)

	//return generated id or nil
	InsertManyContent(collection *mongo.Collection, contents *[]domain.Content) ([]interface{}, error)
	InsertOneContent(collection *mongo.Collection, content *domain.Content) (primitive.ObjectID, error)

	//return updated id or upserted id
	UpsertByType(collection *mongo.Collection, id primitive.ObjectID, content *domain.Content) (primitive.ObjectID, error)
	UpdateById(collection *mongo.Collection, id primitive.ObjectID, content *domain.Content) (primitive.ObjectID, error)
	UpsertSingleContent(collection *mongo.Collection, body domain.Content) domain.Content

	DeleteOneContent(collection *mongo.Collection, contentId string) (succeed bool, err error)
	DeleteAllContent(collection *mongo.Collection, ids []string)
}
