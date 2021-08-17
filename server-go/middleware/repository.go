package middleware

import (
	"server-go/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoApiDomain interface {
	getAllContentByType(collection *mongo.Collection) ([]models.Content, error)
	getContentByMongoId(collection *mongo.Collection, mongoId string) (models.Content, error)
	getContentByElementId(collection *mongo.Collection, id string) (models.Content, error)
	getContentByElementIdAndDate(collection *mongo.Collection, id string, date string) (models.Content, error)

	//return generated id or nil
	insertManyContent(collection *mongo.Collection, contents *[]models.Content) ([]interface{}, error)
	insertOneContent(collection *mongo.Collection, content *models.Content) (primitive.ObjectID, error)

	//return updated id or upserted id
	upsertByType(collection *mongo.Collection, id primitive.ObjectID, content *models.Content) (primitive.ObjectID, error)
	updateById(collection *mongo.Collection, id primitive.ObjectID, content *models.Content) (primitive.ObjectID, error)

	deleteOneContent(collection *mongo.Collection, contentId string) (succeed bool, err error)
	deleteAllContent(collection *mongo.Collection, ids []string)
}
