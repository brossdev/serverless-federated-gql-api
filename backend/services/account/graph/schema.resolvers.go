package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"gql/backend/services/account/db/account"
	"gql/backend/services/account/graph/generated"
	"gql/backend/services/account/graph/model"
)

func (r *mutationResolver) CreateAccount(ctx context.Context, input model.BankAccountInput) (*model.BankAccount, error) {
	userId := ctx.Value("user").(string)
	bankAcc, err := account.CreateBankAccount(ctx, r.DB, r.TableName, userId, input)

	if err != nil {
		fmt.Println("Could not create new bank account")
		return nil, err
	}

	return bankAcc, nil
}

func (r *userResolver) Accounts(ctx context.Context, obj *model.User) ([]*model.BankAccount, error) {
	bankAccs, err := account.GetUserBankAccounts(ctx, r.DB, r.TableName, obj.ID)

	if err != nil {
		fmt.Println("Could not retrieve user accounts")
		return nil, err
	}

	return bankAccs, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type mutationResolver struct{ *Resolver }
type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
type queryResolver struct{ *Resolver }
