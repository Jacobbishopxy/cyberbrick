package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Content struct {
	Id           primitive.ObjectID     `json:"id,omitempty" bson:"_id,omitempty"`
	Date         primitive.DateTime     `json:"date,omitempty" bson:"date,omitempty"`
	Title        string                 `json:"title,omitempty" bson:"title,omitempty"`
	Data         map[string]interface{} `json:"data,omitempty" bson:"data,omitempty"`
	Config       map[string]interface{} `json:"config,omitempty" bson:"config,omitempty"`
	ElementId    string                 `json:"elementId,omitempty" bson:"elementId,omitempty"`
	CategoryName string                 `json:"categoryName,omitempty" bson:"categoryName,omitempty"`
}

type Request struct {
	Content Content `json:"content,omitempty"`
	Type    string  `json:"type"`
}

type RequestChunk struct {
	MultiContent []Content `json:"content,omitempty"`
	Type         string    `json:"type"`
}
