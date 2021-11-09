package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"management/graph/generated"
	"management/graph/model"
	"management/internal/organisations"
	"management/internal/users"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

func (r *mutationResolver) CreateOrganisation(ctx context.Context, input *model.NewOrganisation) (*model.Organisation, error) {
	tableName := ctx.Value("TABLE_NAME").(string)
	fmt.Println(tableName)
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	ddb := dynamodb.New(sess)

	org, err := organisations.CreateOrganisation(ctx, ddb, tableName, *input)

	if err != nil {
		fmt.Println("Could not create new organisation")
	}

	return org, nil
}

func (r *queryResolver) CurrentUser(ctx context.Context) (*model.User, error) {

	tableName := ctx.Value("TABLE_NAME").(string)
	// fmt.Printf("context ------- %v", ctx)
	fmt.Println(tableName)

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	ddb := dynamodb.New(sess)

	user, err := users.GetUser(ctx, ddb, tableName, "bobby.test@bobbyross.dev")

	if err != nil {
		fmt.Println("Broke")
	}

	return user, nil
}

func (r *queryResolver) GetOrganisation(ctx context.Context, organisationID string) (*model.Organisation, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
