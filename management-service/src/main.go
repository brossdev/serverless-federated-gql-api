package main

import (
	"context"
	"log"
	"management/graph"
	"management/graph/generated"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambdaV2

// Defining the Graphql handler
func graphqlHandler() gin.HandlerFunc {
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	h := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	return func(c *gin.Context) {
		tableName := os.Getenv("TABLE_NAME")
		// placeholder until switch out to lambda authriser with decoded token
		user := c.Request.Header.Get("user")
		log.Printf("REQUEST USER --- %v", user)
		ctx := context.WithValue(c.Request.Context(), "TABLE_NAME", tableName)
		ctx2 := context.WithValue(ctx, "user", user)

		c.Request = c.Request.WithContext(ctx2)
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
		// Setting up Gin
		r.POST("/query", graphqlHandler())
		r.GET("/playground", playgroundHandler())
		r.GET("/ping", func(c *gin.Context) {
			log.Println("Handler!!")
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
		r.GET("/graphql", graphqlHandler())

		ginLambda = ginadapter.NewV2(r)
	}
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	// Setting up Gin
	lambda.Start(Handler)
}
