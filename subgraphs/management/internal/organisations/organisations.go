package organisations

import (
	"context"
	"fmt"
	"log"

	"management/graph/model"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

// CreateOrganisation returns a organisation when given a valid dynamodb instance and valid organisation parameters
func CreateOrganisation(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName string, organisation model.NewOrganisation) (*model.Organisation, error) {
	orgKey := fmt.Sprintf("ACCOUNT#%s", organisation.Name)
	newOrg, err := dynamodbattribute.MarshalMap(organisation)
	log.Printf("Attrs: %v", newOrg)
	if err != nil {
		return nil, err
	}

	expressionNames := map[string]*string{
		"#type": aws.String("type"),
	}
	expressionValues := map[string]*dynamodb.AttributeValue{
		":type": {
			S: aws.String("organisation"),
		},
	}
	for key, attribute := range newOrg {
		expressionNames[fmt.Sprintf("#%s", key)] = aws.String(key)
		expressionValues[fmt.Sprintf(":%s", key)] = attribute
	}

	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(orgKey),
			},
			"SK": {
				S: aws.String(orgKey),
			},
		},
		ExpressionAttributeNames:  expressionNames,
		ExpressionAttributeValues: expressionValues,
		UpdateExpression:          aws.String("set #name = :name, #type = :type"),
		ReturnValues:              aws.String("ALL_NEW"),
	}

	result, err := ddb.UpdateItemWithContext(ctx, input)
	log.Printf("Result: %v", result)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}

	org := &model.Organisation{}

	if err := dynamodbattribute.UnmarshalMap(result.Attributes, org); err != nil {
		return nil, err
	}

	return org, nil

}
