package graph

import (
	"context"
	"subgraphs/src/management/graph/generated"
	"subgraphs/src/management/graph/model"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type mockDynamoDb struct {
	mock.Mock
	dynamodbiface.DynamoDBAPI
}

func (m *mockDynamoDb) GetItemWithContext(ctx aws.Context, input *dynamodb.GetItemInput, opts ...request.Option) (*dynamodb.GetItemOutput, error) {
	args := m.Called(input)
	return args.Get(0).(*dynamodb.GetItemOutput), args.Error(1)
}

func (m *mockDynamoDb) PutItemWithContext(ctx aws.Context, input *dynamodb.PutItemInput, opts ...request.Option) (*dynamodb.PutItemOutput, error) {
	args := m.Called(input)
	return args.Get(0).(*dynamodb.PutItemOutput), args.Error(1)
}

func (m *mockDynamoDb) UpdateItemWithContext(ctx aws.Context, input *dynamodb.UpdateItemInput, opts ...request.Option) (*dynamodb.UpdateItemOutput, error) {
	args := m.Called(input)
	return args.Get(0).(*dynamodb.UpdateItemOutput), args.Error(1)
}

func (m *mockDynamoDb) TransactWriteItemsWithContext(ctx aws.Context, input *dynamodb.TransactWriteItemsInput, opts ...request.Option) (*dynamodb.TransactWriteItemsOutput, error) {
	args := m.Called(input)
	return args.Get(0).(*dynamodb.TransactWriteItemsOutput), args.Error(1)
}

func addContext(userID string) client.Option {
	return func(bd *client.Request) {
		ctx := context.WithValue(bd.HTTP.Context(), "user", userID)
		bd.HTTP = bd.HTTP.WithContext(ctx)
	}
}

func MockUserGetItemOutput(firstName, lastName, email string) *dynamodb.GetItemOutput {
	return &dynamodb.GetItemOutput{
		Item: map[string]*dynamodb.AttributeValue{
			"firstName": {
				S: &firstName,
			},
			"lastName": {
				S: &lastName,
			},
			"email": {
				S: &email,
			},
		},
	}
}

func MockOrgUpdateItemOutput(name string) *dynamodb.UpdateItemOutput {
	return &dynamodb.UpdateItemOutput{
		Attributes: map[string]*dynamodb.AttributeValue{
			"name": {
				S: &name,
			},
		},
	}
}

func TestUser(t *testing.T) {
	tableName := "test"
	mockDB := mockDynamoDb{}
	mockDB.Mock.On("GetItemWithContext", mock.Anything).Return(MockUserGetItemOutput("bob", "ross", "bob@ross.test.com"), nil)

	c := client.New(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{DB: &mockDB, TableName: tableName}})), addContext("1"))

	t.Run("get current user", func(t *testing.T) {
		var resp struct {
			GetCurrentUser *model.User
		}
		c.MustPost(`query { getCurrentUser { firstName, lastName } }`, &resp)

		assert.Equal(t, "bob", resp.GetCurrentUser.FirstName)
		assert.Equal(t, "ross", resp.GetCurrentUser.LastName)
	})
}

func TestOrganisation(t *testing.T) {
	tableName := "test"
	mockDB := mockDynamoDb{}
	mockDB.Mock.On("TransactWriteItemsWithContext", mock.Anything).Return(&dynamodb.TransactWriteItemsOutput{}, nil)

	c := client.New(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{DB: &mockDB, TableName: tableName}})), addContext("1"))

	t.Run("create organisation", func(t *testing.T) {
		var resp struct {
			CreateOrganisation *model.Organisation
		}
		c.MustPost(`mutation($input: OrganisationInput!) { createOrganisation(input: $input) { name } }`, &resp, client.Var("input", &model.OrganisationInput{Name: "naughtydog"}))

		assert.Equal(t, "naughtydog", resp.CreateOrganisation.Name)
	})
}
