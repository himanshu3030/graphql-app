import { ApolloServer } from '@apollo/server';
import { prisma } from "../lib/prisma.js"
import {User} from './user/index.js'

async function CreateApolloGraphqlServer(){

    const gqlServer = new ApolloServer({
        
        typeDefs: `
           type Query {
             ${User.queries}

           }
           type Mutation {
             ${User.mutation}
           }
        `,
        resolvers: {
            Query: {
               ...User.resolver.queries
            },
            Mutation:{
                 ...User.resolver.mutation
                   
            }
            
        },
    });

    await gqlServer.start();

    return gqlServer
}

export default CreateApolloGraphqlServer;