# {projectName}

{projectDescription}

## 🏗️ Project Architecture

```
{projectName}/
├── backend/               # Backend Services
│   ├── nodejs/           # Node.js + TypeScript + GraphQL
│   └── python/           # Python Backend (Optional)
├── frontend/              # Frontend Applications
│   ├── nextjs/           # Next.js App (React 19)
│   ├── sveltekit/        # SvelteKit App (Optional)
│   └── shared/           # Shared Frontend Code
├── database/              # Database Management
│   ├── migrations/       # Database Migrations
│   ├── seeds/            # Seed Data
│   ├── schemas/          # Schema Definitions (MySQL/PostgreSQL)
│   └── configs/          # Database Configurations
├── _docs/                 # Documentation
│   ├── README.md         # Documentation Index
│   ├── setup/            # Setup & Configuration Guides
│   ├── planning/         # Project Planning
│   ├── design/           # Design Resources
│   ├── api/              # API Documentation
│   ├── features/         # Feature Specifications
│   ├── technical/        # Technical Specifications
│   └── implementation/   # Implementation Guides
├── .env                   # Environment Variables
└── README.md              # This File
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+ (if using Python backend)
- Docker & Docker Compose
- PostgreSQL and/or MySQL (via Docker)

### 1. Environment Setup

```bash
# Copy environment variables
cp .env.example .env

# Update the .env file with your configuration
# See _docs/setup/ENV_SETUP.md for detailed guide
```

### 2. Backend Setup (Node.js)

```bash
cd backend/nodejs
npm install
npm run dev
```

**Default Port**: `{BE_NODEJS_PORT_DEV}` (Development)

**GraphQL Playground**: `http://{BASE_IP}:{API_GRAPHQL_PORT_DEV}/graphql`

### 3. Backend Setup (Python) - Optional

```bash
cd backend/python
pip install -r requirements.txt
python -m uvicorn main:app --reload --port {BE_PYTHON_PORT_DEV}
```

**Default Port**: `{BE_PYTHON_PORT_DEV}` (Development)

### 4. Frontend Setup (Next.js)

```bash
cd frontend/nextjs
npm install
npm run dev
```

**Default Port**: `{FE_NEXTJS_PORT_DEV}` (Development)

**Access**: `http://{BASE_IP}:{FE_NEXTJS_PORT_DEV}`

### 5. Frontend Setup (SvelteKit) - Optional

```bash
cd frontend/sveltekit
npm install
npm run dev
```

**Default Port**: `{FE_SVELTEKIT_PORT_DEV}` (Development)

## 🛠️ Technology Stack

### Backend
- **Node.js** - TypeScript + SWC
- **GraphQL** - Apollo Server
- **Database ORM** - TypeORM
- **Authentication** - JWT
- **Python** - FastAPI + SQLAlchemy (Optional)

### Frontend
- **Next.js 15** - React 19 + App Router
- **SvelteKit** - Alternative frontend (Optional)
- **Styling** - Tailwind CSS 4
- **State Management** - React Context / Svelte Stores
- **API Client** - Apollo Client / GraphQL Codegen

### Database
- **PostgreSQL** - Primary database (recommended)
- **MySQL/MariaDB** - Alternative database
- **TypeORM** - Migrations and schema management

### Infrastructure
- **Docker** - Containerization
- **N8N** - Workflow automation (platform-level)
- **Nginx** - Reverse proxy (platform-level)

## 📋 Available Scripts

### Backend (Node.js)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend (Next.js/SvelteKit)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run test         # Run tests
```

### Database
```bash
npm run migration:generate  # Generate migration from entities
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration
npm run db:seed             # Seed database with test data
```

## 🔌 Port Allocation

This project uses an automated port allocation system.

### Production Ports
- SSH: `{SSH_PORT_PROD}`
- Backend (Node.js): `{BE_NODEJS_PORT_PROD}`
- Backend (Python): `{BE_PYTHON_PORT_PROD}`
- API (GraphQL): `{API_GRAPHQL_PORT_PROD}`
- API (REST): `{API_REST_PORT_PROD}`
- Frontend (Next.js): `{FE_NEXTJS_PORT_PROD}`
- Frontend (SvelteKit): `{FE_SVELTEKIT_PORT_PROD}`

### Development Ports
- Backend (Node.js): `{BE_NODEJS_PORT_DEV}`
- Backend (Python): `{BE_PYTHON_PORT_DEV}`
- API (GraphQL): `{API_GRAPHQL_PORT_DEV}`
- API (REST): `{API_REST_PORT_DEV}`
- Frontend (Next.js): `{FE_NEXTJS_PORT_DEV}`
- Frontend (SvelteKit): `{FE_SVELTEKIT_PORT_DEV}`

**Note**: Ports are automatically assigned during project creation. Never modify them manually.

## 🗄️ Database Configuration

### Connection Details

**PostgreSQL**:
- Host: `{POSTGRES_HOST}`
- Port: `{POSTGRES_PORT}`
- Database: `{POSTGRES_DB_NAME}`
- User: `{POSTGRES_DB_USER}`

**MySQL** (if used):
- Host: `{MYSQL_HOST}`
- Port: `{MYSQL_PORT}`
- Database: `{MYSQL_DB_NAME}`
- User: `{MYSQL_DB_USER}`

**Important**: Database credentials are stored in `.env` file. Never commit sensitive credentials to version control.

## 📚 Documentation

Comprehensive documentation is available in the `_docs/` folder:

- **[Documentation Index](_docs/README.md)** - Start here
- **[Environment Setup](_docs/setup/ENV_SETUP.md)** - Detailed environment configuration
- **[API Documentation](_docs/api/)** - GraphQL/REST API reference
- **[Features](_docs/features/)** - Feature specifications
- **[Technical Specs](_docs/technical/)** - Architecture and technical details
- **[Implementation](_docs/implementation/)** - Development guides

## ✨ Features

- [ ] User Authentication & Authorization
- [ ] GraphQL API
- [ ] Database Migrations
- [ ] Responsive Frontend
- [ ] Docker Support
- [ ] Environment-based Configuration

**Tip**: Update this checklist as you implement features!

## 🧪 Testing

```bash
# Backend tests
cd backend/nodejs
npm test
npm run test:watch
npm run test:coverage

# Frontend tests
cd frontend/nextjs
npm test
npm run test:e2e
```

## 🚢 Deployment

### Development
```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
# Build production images
npm run build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-specific Deployment
```bash
# Staging
NODE_ENV=staging npm run build
npm run start:staging

# Production
NODE_ENV=production npm run build
npm run start:production
```

## 🔒 Security

- Environment variables are never committed to version control
- Database credentials are auto-generated during project creation
- JWT secrets are unique per project
- CORS is configured for allowed origins only
- SQL injection protection via TypeORM parameterized queries

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit a pull request

## 📞 Support

- **GitHub**: [{GITHUB_USER}/{projectName}](https://github.com/{GITHUB_USER}/{projectName})
- **Documentation**: [_docs/README.md](_docs/README.md)
- **Issues**: [GitHub Issues](https://github.com/{GITHUB_USER}/{projectName}/issues)

## 📄 License

This project is part of the {PLATFORM_NAME} platform.

---

**Platform**: {PLATFORM_NAME}
**Project SN**: {PROJECT_SN}
**Base Port**: {BASE_PROJECT_PORT}
**Created**: {TIMESTAMP}
