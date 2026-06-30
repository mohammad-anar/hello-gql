const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");
const { default: axios } = require("axios");


async function startServer() {
  const app = express();

  const typeDefs = `#graphql
  
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

  const resolvers = {
    Query: {
      books: () => books,
    },
  };

  const server = new ApolloServer({
    typeDefs: `
        type Todo {
            id: ID!
            userId: ID!
            title: String!
            completed: Boolean
            user: User
        }

        type Company {
          name: String!
          catchPhrase: String
          bs: String
        }

        type User {
          id: ID!
          name: String!
          username: String!
          email: String!
          phone: String!
          website: String
          company: Company
        }

        type Query {
            getTodos: [Todo],
            getUsers: [User],
            getUser(id:ID!): User,
        }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,

        getUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,

        getUser: async (parent, {id}) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
      },
    },
  });

  await server.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
}

startServer().catch((err) => {
  console.error(err);
});
