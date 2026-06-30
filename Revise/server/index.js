const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

const startServer = async () => {
  const port = process.env.port || 4000;
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
        type User {
          id: ID!
          name: String!
          username: String!
          email: String!
          phone: String
          website: String
        }

        type Todo {
            id: ID!
            userId: ID!
            title: String!
            completed: Boolean
            user: User

        }

        type Query {
            getTodos: [Todo]
            getTodoById(id:ID!): Todo
            getAllUsers: [User]
            getUserById(id:ID!): User
        }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>  (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
      },
      Query: {
        getTodos: async () => (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getTodoById: async (parent, {id}) => (await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`)).data,
        getAllUsers: async () => (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUserById: async (parent, {id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(port, () => {
    console.log("Server is listening on port", port);
  });
};

startServer();
