package organisations

import (
	"context"
	"fmt"
	"log"
	"time"
    "strings"

	"management/graph/model"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

type DBOrganisation struct {
	*model.OrganisationInput
	PK        string
	SK        string
	Type      string
	CreatedAt string
}

type DBOrganisationMembership struct {
	PK        string
	SK        string
	CreatedAt string
	UserID    string
	Role      string
}

type DBUserOrg struct {
    KeyName string
	Name string
	Role string
}

func CreateOrganisation(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName, userID string, organisation model.OrganisationInput) (*model.Organisation, error) {
	// create organisation
    orgName := strings.ToLower(strings.Join(strings.Fields(strings.TrimSpace(organisation.Name)), "-"))
	orgKey := fmt.Sprintf("ACCOUNT#%s", orgName)
	createdAt := time.Now().Format("2021-12-01 17:06:06")
	dbOrg := DBOrganisation{
		&organisation,
		orgKey,
		orgKey,
		"organisation",
		createdAt,
	}

	newOrg, err := dynamodbattribute.MarshalMap(dbOrg)
	log.Printf("Attrs: %v", newOrg)
	if err != nil {
		return nil, err
	}

	createOrgInput := &dynamodb.Put{
		TableName: aws.String(tableName),
		Item:      newOrg,
	}

	// create membership
	membershipKey := fmt.Sprintf("MEMBERSHIP#%s", userID)

	orgMembership := DBOrganisationMembership{
		PK:     orgKey,
		SK:     membershipKey,
		UserID: userID,
		Role:   "admin",
	}

	newMembership, err := dynamodbattribute.MarshalMap(orgMembership)

	log.Printf("Membership Attrs: %v", newMembership)
	if err != nil {
		return nil, err
	}

	createMembershipInput := &dynamodb.Put{
		TableName: aws.String(tableName),
		Item:      newMembership,
	}

	// update user with organisation

	userKey := fmt.Sprintf("ACCOUNT#%s", userID)

	userOrgEntry := &DBUserOrg{
        KeyName: orgName,
		Name: organisation.Name,
		Role: "admin",
	}

	userOrg, err := dynamodbattribute.MarshalMap(userOrgEntry)

	log.Printf("User Org Attrs: %v", userOrg)
	if err != nil {
		return nil, err
	}

	updateUserOrgs := &dynamodb.Update{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(userKey),
			},
			"SK": {
				S: aws.String(userKey),
			},
		},
		UpdateExpression: aws.String("SET organisations = list_append(if_not_exists(organisations, :empty_list), :userOrgList)"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":userOrgList": {
				L: []*dynamodb.AttributeValue{
					{
						M: userOrg,
					},
				},
			},
			":emptyList": {
				L: []*dynamodb.AttributeValue{},
			},
		},
	}
	input := &dynamodb.TransactWriteItemsInput{
		TransactItems: []*dynamodb.TransactWriteItem{
			{
				Put: createOrgInput,
			},
			{
				Put: createMembershipInput,
			},
			{
				Update: updateUserOrgs,
			},
		},
	}

	_, err = ddb.TransactWriteItemsWithContext(ctx, input)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}

    org := &model.Organisation{Name: organisation.Name}

	return org, nil

}

// UpdateOrganisation returns a organisation when given a valid dynamodb instance and valid organisation parameters to update
func UpdateOrganisation(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName string, organisation model.OrganisationInput) (*model.Organisation, error) {
    // once gqlgen has run update the model type and use the previous org name for updating
    orgName := strings.ToLower(strings.Join(strings.Fields(strings.TrimSpace(organisation.Name)), "-"))
	orgKey := fmt.Sprintf("ACCOUNT#%s", orgName)
	updateOrg, err := dynamodbattribute.MarshalMap(organisation)
	log.Printf("Attrs: %v", updateOrg)
	if err != nil {
		return nil, err
	}

	expressionNames := map[string]*string{}
	expressionValues := map[string]*dynamodb.AttributeValue{}
	for key, attribute := range updateOrg {
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
		UpdateExpression:          aws.String("set #name = :name, #contactEmail = :contactEmail"),
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
