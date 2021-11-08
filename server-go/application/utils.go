package application

import (
	"context"
	"fmt"
	"log"
	"server-go/domain"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// custom time from Postgres column type `timestamp`
const PgTimestampFormat = "2006-01-02 15:04:05"

/*
Helper func to query database. Takes collection, filter and findOptions as param,
return an array of data
*/
func getContent(collection *mongo.Collection, filter interface{}, findOptions *options.FindOptions) ([]domain.Content, error) {
	var results []domain.Content
	cur, err := collection.Find(context.Background(), filter, findOptions)
	if err != nil {
		log.Println(err)
		return results, err
	}
	//iterate over your cursor and have it retrieve your data in batches
	for cur.Next(context.Background()) {
		var result domain.Content
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

// func parseRequestChunkBody(r *http.Request) domain.RequestChunk {
// 	var body domain.RequestChunk
// 	err := json.NewDecoder(r.Body).Decode(&body)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	return body
// }
func contentValidation(content *domain.Content) bool {
	if content.Date == 0 || content.ElementId == "" {
		fmt.Println("date or elementId is undefined!")
		return false
	}
	return true
}
