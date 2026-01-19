import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
// import cors from 'cors';
import{ prisma } from "./lib/prisma"

async function startServer() {
    const app = express();
    app.use(express.json());

    const gqlServer = new ApolloServer({
        // 1. Fixed '=' to ':' 
        // 2. Added 'say' to schema 
        // 3. Changed 'string' to 'String'
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstame: String!, lastname: String!, email: String, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => `hey there, I am a graphql server`,
                // Fixed typo 'stirng' and parameter syntax
                say: (_: any, { name }: { name: string }) => `hey ${name}, how are you`
            },
            Mutation:{
                 createUser: async(
                    _, {firstname, lastname, email, password

                    }:{
                        firstname:string, lastname:string, email: string, password: string
                    }
                )=>{
                    await prisma.user.create({
                        data:{
                            email,
                            firstname,
                            lastname,
                            password,
                            salt: "random_salt",
                        }
                    })
                    return true
                }
            }
        },
    });

    // Ensure the server starts before applying middleware
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({
            message: "server is up and running"
        });
    });

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(5000, () => {
        console.log("🚀 SERVER IS RUNNING AT http://localhost:5000/graphql");
    });
}

startServer();