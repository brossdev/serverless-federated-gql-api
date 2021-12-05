package main

import (
	"context"
	"log"
	"os"
	"subgraph/account/graph"
	"subgraph/account/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambdaV2

// Defining the Graphql handler
func graphqlHandler() gin.HandlerFunc {
	tableName := os.Getenv("TABLE_NAME")
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	ddb := dynamodb.New(sess)
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	h := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: ddb, TableName: tableName}}))

	return func(c *gin.Context) {
		// placeholder until switch out to lambda authriser with decoded token
		user := c.Request.Header.Get("user")
		log.Printf("REQUEST USER --- %v", user)
		ctx := context.WithValue(c.Request.Context(), "user", user)

		c.Request = c.Request.WithContext(ctx)
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// Defining the Playground handler
func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	log.Printf("ctx: %v", ctx)
	log.Printf("req: %v", req)
	if ginLambda == nil {
		// stdout and stderr are sent to AWS CloudWatch Logs
		log.Printf("Gin cold start")
		r := gin.Default()
		r.POST("/query", graphqlHandler())
		r.GET("/playground", playgroundHandler())
		r.GET("/graphql", graphqlHandler())

		ginLambda = ginadapter.NewV2(r)
	}
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
