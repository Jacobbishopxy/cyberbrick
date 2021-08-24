package application

import (
	"server-go/domain"
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

//implement MongoApiService
var _ domain.MongoApiService = &MongoApi{}
