const app = require('express')()
const expressGraphql = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
  type User {
    id: ID
    name: String
    repo: String
    age: Int
  }
  type Query {
    user(id: ID!): User
    users: [User]
  }
  type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
  }
`)

const providers = {
  users: []
}

let id = 0

const resolvers = {
  user ({ id }) {
    return providers.users.find(item => item.id === Number(id))
  },
  users () {
    return providers.users
  },
  createUser ({ name, repo, age }) {
    const user = {
      id: id++,
      name,
      repo,
      age
    }

    providers.users.push(user)

    return user
  }
}

app.use(
  '/graphql',
  expressGraphql({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
)

app.listen(3000)
