package users

import (
	"context"
	"fmt"
	"log"

	"gql/backend/services/management/graph/model"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

// GetUser returns a user when given a valid dynamodb instance and valid email address
func GetUser(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName, ID string) (*model.User, error) {
	userKey := fmt.Sprintf("ACCOUNT#%s", ID)
	user := &model.User{}

	log.Println(tableName)
	log.Println(userKey)
	input := &dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(userKey),
			},
			"SK": {
				S: aws.String(userKey),
			},
		},
	}

	result, err := ddb.GetItemWithContext(ctx, input)
	log.Printf("result: %v", result)
	if err != nil {
		log.Printf("err: %v", err)
		return nil, err
	}

	if err := dynamodbattribute.UnmarshalMap(result.Item, user); err != nil {
		return nil, err
	}

	return user, nil

}
