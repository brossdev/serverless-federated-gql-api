package account

import (
	"context"
	"fmt"
	"log"
	"subgraphs/src/account/graph/model"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type DBBankAccount struct {
	*model.BankAccountInput
	PK        string
	SK        string
	ID        string
	OwnerId   string
	CreatedAt int64 `dynamodbav:"createdAt"`
}

func CreateBankAccount(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName, userID string, account model.BankAccountInput) (*model.BankAccount, error) {
	accountNumber := "1"
	bankAccountPK := fmt.Sprintf("ACCOUNT#%s", userID)
	bankAccountSK := fmt.Sprintf("BANKACCOUNT#%s", accountNumber)
	createdAt := time.Now().Unix()
	bankAccount := DBBankAccount{
		&account,
		bankAccountPK,
		bankAccountSK,
		accountNumber,
		userID,
		createdAt,
	}

	newBankAccount, err := dynamodbattribute.MarshalMap(bankAccount)
	if err != nil {
		return nil, err
	}

	createAccInput := &dynamodb.Put{
		TableName: &tableName,
		Item:      newBankAccount,
	}

	userKey := fmt.Sprintf("ACCOUNT#%s", userID)

	userAccEntry := &model.UserBankAccount{
		AccountNumber: accountNumber,
		Name:          account.Name,
		Balance:       0,
	}

	userAcc, err := dynamodbattribute.MarshalMap(userAccEntry)

	log.Printf("User Acc Attrs: %v", userAcc)
	if err != nil {
		return nil, err
	}

	updateUserAccounts := &dynamodb.Update{
		TableName: &tableName,
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(userKey),
			},
			"SK": {
				S: aws.String(userKey),
			},
		},
		UpdateExpression: aws.String("SET accounts = list_append(if_not_exists(accounts, :emptyList), :userAccList)"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":userAcList": {
				L: []*dynamodb.AttributeValue{
					{
						M: userAcc,
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
				Put: createAccInput,
			},
			{
				Update: updateUserAccounts,
			},
		},
	}
	_, err = ddb.TransactWriteItemsWithContext(ctx, input)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}

	acc := &model.BankAccount{Name: account.Name}

	return acc, nil

}
