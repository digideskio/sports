// convert user contacts struct
package main

import (
	"flag"
	"labix.org/v2/mgo/bson"
	"log"
)

func init() {
	flag.StringVar(&MongoAddr, "mongo", "localhost:27017", "mongodb server")
	flag.Parse()
}

type Account struct {
	Id    string   `bson:"_id,omitempty"`
	Actor []string `bson:",omitempty"`
}

func main() {
	var users []Account

	total := 0
	search("accounts", nil, bson.M{"actor": 1}, 0, 0, nil, &total, &users)

	for _, user := range users {
		if len(user.Actor) == 0 {
			continue
		}
		//var actor []string
		//actor = append(actor, user.Actor)
		set := bson.M{}
		for _, actor := range user.Actor {
			if actor == "admin" {
				set["admin"] = true
			} else {
				set["actor"] = actor
			}
		}
		if err := updateId("accounts", user.Id, bson.M{"$set": set}, true); err != nil {
			log.Println(err)
		}
	}
}