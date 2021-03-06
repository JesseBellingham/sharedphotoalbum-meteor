import { ApolloServer } from 'apollo-server-express'
import { WebApp } from 'meteor/webapp'
import { getUser } from 'meteor/apollo'

import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
        user: async () => await getUser(req.headers.authorization),
    }),
})

server.applyMiddleware({
    app: WebApp.connectHandlers,
    path: '/graphql',
    bodyParserConfig: {
        limit: '100mb',
    },
})

WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
        res.end()
    }
})
