package account

import (
	"context"
	"fmt"
	"gql/backend/services/account/graph/model"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/segmentio/ksuid"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type DBBankAccount struct {
	model.BankAccountInput
	PK        string
	SK        string
	ID        string
	OwnerId   string
	CreatedAt int64 `dynamodbav:"createdAt"`
}

func CreateBankAccount(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName, userID string, account model.BankAccountInput) (*model.BankAccount, error) {
	accountId := ksuid.New().String()
	bankAccountPK := fmt.Sprintf("ACCOUNT#%s", userID)
	bankAccountSK := fmt.Sprintf("BANKACCOUNT#%s", accountId)
	createdAt := time.Now().Unix()
	bankAccount := DBBankAccount{
		account,
		bankAccountPK,
		bankAccountSK,
		accountId,
		userID,
		createdAt,
	}

	newBankAccount, err := dynamodbattribute.MarshalMap(bankAccount)
	if err != nil {
		return nil, err
	}

	createAccInput := &dynamodb.PutItemInput{
		TableName: &tableName,
		Item:      newBankAccount,
	}

	// userKey := fmt.Sprintf("ACCOUNT#%s", userID)

	// userAccEntry := &model.UserBankAccount{
	// 	AccountID: accountId,
	// 	Name:      account.Name,
	// 	Balance:   0,
	// }

	// userAcc, err := dynamodbattribute.MarshalMap(userAccEntry)

	// log.Printf("User Acc Attrs: %v", userAcc)
	// if err != nil {
	// 	return nil, err
	// }

	// updateUserAccounts := &dynamodb.Update{
	// 	TableName: &tableName,
	// 	Key: map[string]*dynamodb.AttributeValue{
	// 		"PK": {
	// 			S: aws.String(userKey),
	// 		},
	// 		"SK": {
	// 			S: aws.String(userKey),
	// 		},
	// 	},
	// 	UpdateExpression: aws.String("SET accounts = list_append(if_not_exists(accounts, :emptyList), :userAccList)"),
	// 	ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
	// 		":userAccList": {
	// 			L: []*dynamodb.AttributeValue{
	// 				{
	// 					M: userAcc,
	// 				},
	// 			},
	// 		},
	// 		":emptyList": {
	// 			L: []*dynamodb.AttributeValue{},
	// 		},
	// 	},
	// }
	// input := &dynamodb.TransactWriteItemsInput{
	// 	TransactItems: []*dynamodb.TransactWriteItem{
	// 		{
	// 			Put: createAccInput,
	// 		},
	// 		{
	// 			Update: updateUserAccounts,
	// 		},
	// 	},
	// }
	_, err = ddb.PutItemWithContext(ctx, createAccInput)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}

	acc := &model.BankAccount{Name: account.Name}

	return acc, nil

}

func GetUserBankAccounts(ctx context.Context, ddb dynamodbiface.DynamoDBAPI, tableName, userID string) ([]*model.BankAccount, error) {
	userKey := fmt.Sprintf("ACCOUNT#%s", userID)
	bankAccKey := "BANKACCOUNT#"
	bankAccounts := []*model.BankAccount{}

	log.Println(tableName)
	log.Println(userKey)
	input := &dynamodb.QueryInput{
		TableName: &tableName,
		KeyConditions: map[string]*dynamodb.Condition{
			"PK": {
				ComparisonOperator: aws.String("EQ"),
				AttributeValueList: []*dynamodb.AttributeValue{
					{
						S: aws.String(userKey),
					},
				},
			},
			"SK": {
				ComparisonOperator: aws.String("BEGINS_WITH"),
				AttributeValueList: []*dynamodb.AttributeValue{
					{
						S: aws.String(bankAccKey),
					},
				},
			},
		},
	}

	result, err := ddb.QueryWithContext(ctx, input)
	log.Printf("result: %v", result)
	if err != nil {
		log.Printf("err: %v", err)
		return nil, err
	}

	if err := dynamodbattribute.UnmarshalListOfMaps(result.Items, &bankAccounts); err != nil {
		return nil, err
	}

	return bankAccounts, nil

}
