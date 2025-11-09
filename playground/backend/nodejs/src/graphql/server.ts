import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { typeDefs } from './typeDefs/index.js';
import { resolvers } from './resolvers/index.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
const envPath = path.resolve(__dirname, '../../../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('API_GRAPHQL_PORT:', process.env.API_GRAPHQL_PORT);
const PORT = process.env.API_GRAPHQL_PORT || 4001;

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: true,
  });

  await server.start();

  // Apply helmet to all routes except GraphQL (to allow playground)
  app.use((req, res, next) => {
    if (req.path === '/graphql') {
      return next();
    }
    helmet()(req, res, next);
  });

  app.use(
    '/graphql',
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    }),
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: '{{PROJECT_NAME}}-graphql',
      timestamp: new Date().toISOString()
    });
  });

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 ilmac-work-web GraphQL server ready at http://localhost:${PORT}/graphql`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}

// Start the server
startApolloServer().catch((error) => {
  console.error('Failed to start Apollo Server:', error);
  process.exit(1);
});
