package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// collection schema
type Content struct {
	Id           primitive.ObjectID     `json:"id,omitempty" bson:"_id,omitempty"`
	Date         primitive.DateTime     `json:"date,omitempty" bson:"date,omitempty"`
	Data         map[string]interface{} `json:"data,omitempty" bson:"data,omitempty"`
	Config       map[string]interface{} `json:"config,omitempty" bson:"config,omitempty"`
	ElementId    string                 `json:"elementId,omitempty" bson:"elementId,omitempty"`
	CategoryName string                 `json:"categoryName,omitempty" bson:"categoryName,omitempty"`
}

//@depreciated
// type Request struct {
// 	Content Content `json:"content,omitempty"`
// 	Type    string  `json:"type"`
// }
