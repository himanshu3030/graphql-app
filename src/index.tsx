import express from 'express';

import { expressMiddleware } from '@as-integrations/express5';
// import cors from 'cors';
// import{ prisma } from "./lib/prisma.js"
import CreateApolloGraphqlServer from "./graphql/index.js"

async function startServer() {
    const app = express();
    app.use(express.json())


    app.get("/", (req, res) => {
        res.json({
            message: "server is up and running"
        });
    });

    app.use('/graphql', expressMiddleware(await CreateApolloGraphqlServer()));

    app.listen(5000, () => {
        console.log("🚀 SERVER IS RUNNING AT http://localhost:5000/graphql");
    });
}

startServer();