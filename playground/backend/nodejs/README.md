# {{PROJECT_NAME}} Backend

{{PROJECT_DESCRIPTION}} backend service built with Node.js, TypeScript, Express, and GraphQL.

## 🏗️ Architecture

### Current Structure (Metadata-Driven Ready)

This template is configured for **metadata-driven development**:

```
backend/
├── src/
│   ├── generated/              # 🔒 Auto-generated code (DO NOT EDIT)
│   │   ├── types/              # TypeScript types from metadata
│   │   ├── graphql/            # GraphQL typeDefs & basic resolvers
│   │   │   ├── typeDefs/       # GraphQL SDL
│   │   │   └── resolvers/      # CRUD resolvers
│   │   ├── services/           # Basic CRUD services
│   │   └── database/           # DDL migrations
│   │       └── migrations/
│   │
│   ├── custom/                 # ✏️ Custom code (YOUR CODE HERE)
│   │   ├── resolvers/          # Extended resolvers (auth, business logic)
│   │   ├── services/           # Extended services
│   │   ├── middleware/         # Authentication, authorization, etc.
│   │   ├── validators/         # Custom validation logic
│   │   └── dataloaders/        # DataLoader for N+1 prevention
│   │
│   ├── graphql/                # 📝 Template GraphQL server (starter)
│   │   ├── resolvers/          # Sample resolvers
│   │   ├── typeDefs/           # Sample type definitions
│   │   └── server.ts           # Apollo Server setup
│   │
│   ├── config/                 # ⚙️ Configuration files
│   │   └── database.ts         # Database connection config
│   │
│   ├── types/                  # 📐 Common TypeScript types
│   │   └── index.ts            # API response types, etc.
│   │
│   ├── utils/                  # 🔧 Utility functions
│   ├── tests/                  # 🧪 Test files
│   └── index.ts                # 🚀 Express server entry point
│
├── dist/                       # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── .swcrc
└── .env.example
```

**Directory Purpose**:
- `generated/` - Code auto-created from metadata (regenerated on changes)
- `custom/` - Your business logic (extends generated code)
- `graphql/` - Template starter code (use as reference or replace with generated)
- `config/` - Application configuration
- `types/` - Project-wide TypeScript types
- `utils/` - Reusable helper functions
- `tests/` - Test suites

### Usage Workflow

**For metadata-driven development**:

**Key Principles**:
- 🔒 **NEVER edit** files in `src/generated/` - they are auto-regenerated
- ✏️ **Write your code** in `src/custom/` - extend generated classes
- 🔄 **Metadata is source of truth** - update PostgreSQL metadata, then regenerate

**📖 For detailed guide**: See [METADATA-DRIVEN-STRUCTURE.md](./METADATA-DRIVEN-STRUCTURE.md)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MySQL 8.0+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run graphql:dev` - Start GraphQL server in development
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🛠️ Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Web Framework**: Express.js
- **GraphQL**: Apollo Server
- **Database**: MySQL with mysql2
- **Build Tool**: SWC
- **Testing**: Vitest
- **Code Quality**: ESLint + Prettier

## 📖 API Documentation

### REST Endpoints

- `GET /health` - Health check
- `GET /api` - API information

### GraphQL Endpoint

- `POST /graphql` - GraphQL endpoint
- Visit `/graphql` in browser for GraphQL Playground (development only)

## 🔧 Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER={{PROJECT_NAME}}_user
DB_PASSWORD={{PROJECT_NAME}}_password
DB_NAME={{PROJECT_NAME}}_db

# Server Configuration
PORT=4000
NODE_ENV=development

# GraphQL Configuration
GRAPHQL_INTROSPECTION=true
GRAPHQL_PLAYGROUND=true

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```