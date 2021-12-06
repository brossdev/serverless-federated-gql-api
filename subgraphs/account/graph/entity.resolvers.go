package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"subgraph/account/graph/generated"
	"subgraph/account/graph/model"
)

func (r *entityResolver) FindOrganisationByID(ctx context.Context, id string) (*model.Organisation, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *entityResolver) FindUserByID(ctx context.Context, id string) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
