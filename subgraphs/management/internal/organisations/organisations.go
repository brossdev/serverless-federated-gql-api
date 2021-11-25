package organisations

import (
    "fmt"
    "context"

    "management/graph/model"
    "github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/service/dynamodb"
    "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
    "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

type OrgItem struct {
    model.NewOrganisation
    pk string
    sk string
}

// CreateOrganisation returns a organisation when given a valid dynamodb instance and valid organisation parameters
func CreateOrganisation(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName string, organisation model.NewOrganisation ) (*model.Organisation, error) {
    orgKey := fmt.Sprintf("ORG#%s", organisation.Name)
    orgItem := OrgItem{
        organisation,
        orgKey,
        orgKey,
    }
    newOrg, err := dynamodbattribute.MarshalMap(orgItem)

    input := &dynamodb.PutItemInput{
        TableName: aws.String(tableName),
        Item: newOrg,
    }

    result, err := ddb.PutItemWithContext(ctx, input)
    if err != nil {
        return nil, err
    }

    org := model.Organisation{}

    if err := dynamodbattribute.UnmarshalMap(result.Attributes, org); err != nil {
        return nil, err
    }

    return &org, nil

}
