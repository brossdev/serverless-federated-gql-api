package graph

import "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB        dynamodbiface.DynamoDBAPI
	TableName string
}
