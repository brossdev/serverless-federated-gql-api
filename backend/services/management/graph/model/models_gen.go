// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Organisation struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	ContactEmail *string `json:"contactEmail"`
	CreatedAt    *string `json:"createdAt"`
}

func (Organisation) IsEntity() {}

type OrganisationInput struct {
	Name         string `json:"name"`
	ContactEmail string `json:"contactEmail"`
}

type User struct {
	ID            string              `json:"id"`
	FirstName     string              `json:"firstName"`
	LastName      string              `json:"lastName"`
	CreatedAt     *string             `json:"createdAt"`
	Organisations []*UserOrganisation `json:"organisations"`
}

func (User) IsEntity() {}

type UserOrganisation struct {
	Name    string  `json:"name"`
	KeyName *string `json:"keyName"`
	Role    *string `json:"role"`
}
