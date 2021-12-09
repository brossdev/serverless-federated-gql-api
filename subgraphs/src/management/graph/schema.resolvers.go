package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"log"
	"subgraphs/src/management/db/organisations"
	"subgraphs/src/management/db/users"
	"subgraphs/src/management/graph/generated"
	"subgraphs/src/management/graph/model"
)

func (r *mutationResolver) CreateOrganisation(ctx context.Context, input *model.OrganisationInput) (*model.Organisation, error) {
	userId := ctx.Value("user").(string)
	org, err := organisations.CreateOrganisation(ctx, r.DB, r.TableName, userId, *input)

	if err != nil {
		fmt.Println("Could not create new organisation")
		return nil, err
	}

	return org, nil
}

func (r *queryResolver) GetCurrentUser(ctx context.Context) (*model.User, error) {
	userId := ctx.Value("user").(string)

	log.Println((userId))

	user, err := users.GetUser(ctx, r.DB, r.TableName, userId)

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
