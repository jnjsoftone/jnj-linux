# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **project template** for creating full-stack applications within the Docker platform management system. Each project created from this template is a self-contained application with backend (Node.js/Python), frontend (Next.js/SvelteKit), and database services, with automatically allocated ports and standardized tooling.

**Key Concept**: This is a template with placeholder variables (e.g., `{{PROJECT_NAME}}`, `${PORT_1}`) that get substituted during project creation via `create-project.sh`.

## Project Architecture

```
ubuntu-project/ (template)
├── backend/
│   ├── nodejs/              # Node.js + TypeScript + GraphQL backend
│   │   ├── src/
│   │   │   ├── generated/   # 🔒 Auto-generated from metadata (DO NOT EDIT)
│   │   │   ├── custom/      # ✏️ Custom business logic (YOUR CODE)
│   │   │   ├── graphql/     # GraphQL server setup
│   │   │   ├── config/      # Configuration files
│   │   │   └── index.ts     # Express server entry point
│   │   ├── scripts/         # Metadata management scripts
│   │   └── package.json
│   └── python/              # Python backend (optional)
├── frontend/
│   ├── nextjs/              # Next.js 13+ with React 18
│   ├── sveltekit/           # SvelteKit (optional)
│   └── shared/              # Shared frontend code
├── database/
│   ├── migrations/          # Database migrations
│   ├── seeds/               # Seed data
│   └── schemas/             # Schema definitions
├── _docs/                   # Comprehensive documentation system
│   ├── 01-requirements/     # Project requirements
│   ├── 02-design/           # Design specs and assets
│   ├── 03-planning/         # Roadmaps and user stories
│   ├── 04-architecture/     # Technical architecture
│   ├── 05-api/              # API documentation
│   ├── 06-development/      # Development guides
│   ├── 07-testing/          # Test cases and strategies
│   ├── 08-deployment/       # Deployment procedures
│   ├── 09-operations/       # Operational runbooks
│   └── 10-collaboration/    # Team processes
├── _resources/              # Design assets and resources
├── _references/             # Benchmarks and inspiration
└── .env                     # Environment variables (auto-generated)
```

## Common Commands

### Backend (Node.js)

```bash
cd backend/nodejs

# Development
npm run dev                  # Start Express server (hot reload with tsx)
npm run graphql:dev          # Start GraphQL server separately

# Production
npm run build               # Build with SWC
npm run start               # Start production server
npm run graphql:start       # Start GraphQL server (production)

# Metadata-driven development
npm run metadata:init       # Initialize metadata tables
npm run metadata:backup     # Backup metadata to JSON
npm run metadata:restore    # Restore metadata from JSON

# Testing & Quality
npm run test                # Run Vitest tests
npm run test:ui             # Run tests with Vitest UI
npm run type-check          # TypeScript type checking
npm run lint                # ESLint
npm run format              # Prettier formatting
```

### Frontend (Next.js)

```bash
cd frontend/nextjs

# Development
npm run dev                 # Start Next.js dev server

# Production
npm run build               # Build for production
npm run start               # Start production server

# Quality
npm run lint                # Next.js linting
npm run type-check          # TypeScript checking
```

### Backend (Python) - Optional

```bash
cd backend/python

# Development
pip install -r requirements.txt
python -m uvicorn main:app --reload --port {PORT}
```

## Metadata-Driven Development

**CRITICAL CONCEPT**: This template supports a metadata-driven architecture where database metadata drives code generation.

### Directory Separation

**Generated Code** (`src/generated/`):
- 🔒 **NEVER edit manually** - auto-regenerated from PostgreSQL metadata
- Contains: TypeScript types, GraphQL typeDefs, CRUD resolvers, basic services, migrations
- May be excluded from Git (team decision)

**Custom Code** (`src/custom/`):
- ✏️ **Your business logic goes here** - freely editable
- Contains: Extended services, authentication, authorization, custom resolvers, middleware
- Always committed to Git

### File Naming Conventions

| Directory | File Pattern | Example | Purpose |
|-----------|--------------|---------|---------|
| `types/` | `*.types.ts` | `user.types.ts` | TypeScript interfaces/types |
| `typeDefs/` | `*.typeDefs.ts` | `user.typeDefs.ts` | GraphQL SDL schemas |
| `resolvers/` | `*.resolver.ts` | `user.resolver.ts` | GraphQL resolvers |
| `services/` | `*Service.ts` | `UserService.ts` | Service classes (PascalCase) |
| `middleware/` | `*.ts` | `authentication.ts` | Express/GraphQL middleware |
| `validators/` | `*.validator.ts` | `user.validator.ts` | Validation logic |
| `migrations/` | `###_*.sql` | `001_create_users.sql` | DB migrations (numbered) |

### Metadata Workflow

```bash
# 1. Define metadata in PostgreSQL
INSERT INTO mappings_table (...) VALUES (...);
INSERT INTO mappings_column (...) VALUES (...);

# 2. Generate code
npm run metadata:init

# 3. Review generated files
src/generated/
├── types/
├── graphql/
├── services/
└── database/

# 4. Extend with custom logic
src/custom/
├── services/UserService.ts      # Extends generated UserService
├── resolvers/auth.resolver.ts   # Custom authentication
└── middleware/authorization.ts  # Custom authorization
```

### Code Extension Pattern

**DO**: Extend generated code via inheritance
```typescript
// src/custom/services/UserService.ts
import { UserService as GeneratedUserService } from '@/generated/services/UserService';

export class UserService extends GeneratedUserService {
  // Add custom methods
  async registerUser(input: CreateUserInput): Promise<User> {
    // Custom business logic
    const existing = await this.findByEmail(input.email);
    if (existing) throw new Error('Email exists');

    // Use parent class methods
    return this.create(input);
  }
}
```

**DON'T**: Modify generated files directly
```typescript
// ❌ src/generated/services/UserService.ts
// Changes will be lost on regeneration!
```

## Port Allocation

**Automatic Port System**: Ports are assigned during project creation via `create-project.sh` and the port-allocator script.

### Port Structure (20 ports per project)

**Production Offsets (0-9)**:
- 0: SSH
- 1: Backend Node.js (`BE_NODEJS_PORT`)
- 2: Backend Python (`BE_PYTHON_PORT`)
- 3: API GraphQL (`API_GRAPHQL_PORT`)
- 4: API REST (`API_REST_PORT`)
- 5: API Reserved
- 6: Frontend Next.js (`FE_NEXTJS_PORT`)
- 7: Frontend SvelteKit (`FE_SVELTE_PORT`)
- 8: Frontend Reserved
- 9: System Reserved

**Development Offsets (10-19)**: Same as production +10

### Environment Variables

All ports are defined in `.env` (auto-generated during project creation):

```bash
# Production ports
BE_NODEJS_PORT=${PORT_1}      # Offset 1
API_GRAPHQL_PORT=${PORT_3}    # Offset 3
FE_NEXTJS_PORT=${PORT_6}      # Offset 6

# Development ports (production port + 10)
# Configured in docker-compose or startup scripts
```

**IMPORTANT**:
- Never hardcode ports - always use environment variables
- Ports are calculated as: `Platform Base + (Project SN × 20) + Offset`
- Port changes require recreating the project

## Documentation System

### Comprehensive 10-Phase Structure

Located in `_docs/`, organized by development lifecycle:

1. **01-requirements/** - What to build (Product Manager, Stakeholders)
2. **02-design/** - Visual and UX design (Design Team)
3. **03-planning/** - Roadmaps and user stories (PM, Tech Lead)
4. **04-architecture/** - Technical foundation (Developers)
5. **05-api/** - API contracts (Backend, Frontend)
6. **06-development/** - Implementation guides (Developers)
7. **07-testing/** - QA and test cases (QA, Developers)
8. **08-deployment/** - Release procedures (DevOps)
9. **09-operations/** - Production operations (Operations)
10. **10-collaboration/** - Team communication (All)

### Key Documentation Files

- `_docs/README.md` - Documentation hub and navigation
- `_docs/QUICK-START.md` - Get started in 15 minutes
- `_docs/DOCUMENTATION-GUIDE.md` - Comprehensive documentation guide
- `backend/nodejs/METADATA-DRIVEN-STRUCTURE.md` - Metadata development guide

### Documentation Language Convention

**CRITICAL**: Follow language naming conventions:

#### File Naming Rules

1. **Default Language: English**
   - Primary documentation files use `.md` extension
   - Example: `README.md`, `PHASE-1-METADATA-TABLES-SETUP.md`, `TYPESCRIPT-CONVENTIONS.md`

2. **Korean Version: `.kr.md` suffix**
   - Korean translations use `.kr.md` extension
   - Example: `README.kr.md`, `01-coding-conventions.kr.md`, `graphql.kr.md`

3. **Other Languages** (if needed in future):
   - Use ISO 639-1 language codes before `.md`
   - Example: `README.ja.md` (Japanese), `README.zh.md` (Chinese)

#### Documentation Creation Process

**Always create English version first, then Korean version:**

```bash
# ✅ Good: English first (default)
README.md
TYPESCRIPT-CONVENTIONS.md
PHASE-1-METADATA-TABLES-SETUP.md

# ✅ Good: Then Korean version
README.kr.md
TYPESCRIPT-CONVENTIONS.kr.md  # (if needed)
PHASE-1-METADATA-TABLES-SETUP.kr.md  # (if needed)

# ❌ Bad: Korean only without English base
README.kr.md  # Missing README.md
```

#### When to Create Korean Versions

- **Required**: User-facing documentation (guides, conventions, READMEs)
- **Optional**: Internal technical specs, API documentation (English is sufficient)
- **User Request**: Create `.kr.md` version when explicitly requested

#### Documentation Language Guidelines

**English Documentation** (`.md`):
- Use clear, concise technical English
- Include code examples with English comments
- Target international developers

**Korean Documentation** (`.kr.md`):
- Translate from English version
- Maintain same structure and sections
- Keep code examples identical (only translate comments)
- Use natural Korean technical terminology

### Templates Available

All templates in `_docs/` subdirectories:
- `01-requirements/templates/requirement-template.md`
- `03-planning/03-user-stories/user-story-template.md`
- `07-testing/02-test-cases/test-case-template.md`
- `10-collaboration/05-bug-reports/bug-report-template.md`

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.x
- **Compiler**: SWC (fast builds), tsx (dev mode)
- **Web Framework**: Express.js
- **GraphQL**: Apollo Server 4
- **Database Drivers**: mysql2, pg
- **ORM/Query**: jnu-db (custom), direct SQL
- **Testing**: Vitest + Vitest UI
- **Linting**: ESLint + Prettier

### Frontend
- **Framework**: Next.js 15.5+ (App Router) or SvelteKit
- **UI Library**: React 19+ or Svelte
- **Component Library**: shadcn/ui (copy-paste components)
- **Styling**: Tailwind CSS 4
- **GraphQL Client**: Apollo Client
- **Type Safety**: TypeScript + GraphQL Codegen

### Database
- **Primary**: PostgreSQL (recommended for metadata-driven)
- **Alternative**: MySQL/MariaDB
- **Migrations**: SQL files (generated or manual)
- **Seeds**: JSON or SQL

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (platform-level)
- **Automation**: N8N (platform-level)

## Coding Conventions

### Core Principles

1. **Type Safety First**: Use TypeScript strict mode, avoid `any`
2. **Functional over OOP**: Prefer pure functions and composition
3. **Explicit over Implicit**: Clear naming, no magic
4. **Fail Fast**: Validate early, throw meaningful errors

### TypeScript Conventions

#### 1. Arrow Functions (REQUIRED)

**All functions must be written as Arrow Functions:**

```typescript
// ✅ Good: Arrow function
const getUserById = async (userId: string): Promise<User | null> => {
  const result = await db.findOne('users', { where: { id: userId } });
  return result.data;
};

// ❌ Bad: function keyword
async function getUserById(userId: string): Promise<User | null> {
  const result = await db.findOne('users', { where: { id: userId } });
  return result.data;
}
```

**Class methods also use arrow functions:**

```typescript
// ✅ Good: Arrow function in class (auto-binds this)
class UserService {
  getUserById = async (userId: string): Promise<User | null> => {
    return this.repository.findOne(userId);
  };
}
```

#### 2. Export at Bottom (REQUIRED)

**All exports must be at the bottom of the file:**

```typescript
// 1. Imports
import { Postgres } from 'jnu-db';
import { User } from '../types';

// 2. Type definitions
interface CreateUserDto {
  name: string;
  email: string;
}

// 3. Functions
const getUserById = async (userId: string): Promise<User | null> => {
  // implementation
};

const createUser = async (data: CreateUserDto): Promise<User> => {
  // implementation
};

// 4. Export section (BOTTOM)
export {
  // Types
  CreateUserDto,

  // Functions
  getUserById,
  createUser,
};
```

**❌ Bad: Inline exports**

```typescript
// ❌ Don't do this
export const getUserById = async (userId: string): Promise<User | null> => {
  // ...
};
```

#### 3. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables/Functions | camelCase | `getUserById`, `isActive` |
| Types/Interfaces | PascalCase | `User`, `CreateUserDto` |
| Classes | PascalCase | `UserService`, `DatabaseService` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Boolean Variables | is/has/should prefix | `isActive`, `hasPermission` |
| Event Handlers | handle prefix | `handleClick`, `handleSubmit` |

#### 4. File Structure

```typescript
/* ============================================
 * 1. External imports
 * ============================================ */
import { Postgres } from 'jnu-db';

/* ============================================
 * 2. Internal imports
 * ============================================ */
import { User } from '../types';

/* ============================================
 * 3. Type definitions
 * ============================================ */
interface UserService {
  getUser: (id: string) => Promise<User>;
}

/* ============================================
 * 4. Constants
 * ============================================ */
const MAX_USERS = 1000;

/* ============================================
 * 5. Helper functions (private)
 * ============================================ */
const validateUser = (user: User): boolean => {
  return !!user.email && !!user.name;
};

/* ============================================
 * 6. Main functions (public)
 * ============================================ */
const getUser = async (id: string): Promise<User> => {
  // ...
};

/* ============================================
 * 7. Export section
 * ============================================ */
export {
  UserService,
  getUser,
};
```

### GraphQL Conventions

#### 1. Domain-Centric Naming

**Pattern**: `{domain}{Entity}{Action}`

```graphql
# ✅ Good
authUserRegister
authUserLogin
authTokenRefresh
userRoleAssign
rolePermissionGrant

# ❌ Bad
register
login
refresh
assignRole
```

#### 2. File Organization

```
graphql/
├── queries/              # Query definitions
│   ├── users.ts
│   └── index.ts
├── mutations/            # Mutation definitions
│   ├── createUser.ts
│   └── index.ts
├── fragments/            # Reusable fragments
│   ├── userFragment.ts
│   └── index.ts
├── types/                # Generated types
│   └── generated.ts
├── client.ts             # Apollo Client setup
└── provider.tsx          # Apollo Provider
```

#### 3. GraphQL Type Definitions

```typescript
// graphql/queries/users.ts
import { gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export { GET_USERS };
```

#### 4. Error Handling

```typescript
import { GraphQLError } from 'graphql';

// Standard error codes
throw new GraphQLError('Invalid credentials', {
  extensions: {
    code: 'UNAUTHENTICATED',
    field: 'email',
  },
});
```

### Next.js Conventions

#### 1. Component Structure

**All components use Arrow Functions:**

```typescript
// ✅ Good: Arrow function component
const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
    </div>
  );
};

export default UserProfile;

// ❌ Bad: function keyword
function UserProfile({ user }: UserProfileProps) {
  return <div>{user.name}</div>;
}
```

#### 2. Server vs Client Components

**Server Components (default):**
- No `'use client'` directive
- Can be async
- Direct data fetching
- No React hooks

**Client Components:**
- `'use client'` at top of file
- Can use hooks (useState, useEffect)
- Event handlers
- Browser APIs

```typescript
// Server Component (default)
const UsersPage = async () => {
  const users = await getUsers();
  return <UserList users={users} />;
};

export default UsersPage;

// Client Component
'use client';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};

export default SearchBox;
```

#### 3. Component Hierarchy (Atomic Design)

```
components/
├── ui/              # shadcn components (atoms)
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── templates/       # Composite components (molecules)
│   ├── action-bar.tsx    # Search + Filter + Button
│   ├── help-slider.tsx   # Help Button + Slide Panel
│   └── data-table.tsx
├── layout/          # Page sections (organisms)
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
└── features/        # Page components (templates)
    ├── user-list.tsx
    └── user-profile.tsx
```

#### 4. GraphQL in Next.js

**Server Components:**
```typescript
import { getClient } from '@/graphql/client';
import { GET_USERS } from '@/graphql/queries';

const UsersPage = async () => {
  const client = getClient();
  const { data } = await client.query({ query: GET_USERS });

  return <UserList users={data.users} />;
};

export default UsersPage;
```

**Client Components:**
```typescript
'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS } from '@/graphql/queries';
import { DELETE_USER } from '@/graphql/mutations';

const UserListInteractive = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  // Component logic
};

export default UserListInteractive;
```

#### 5. Styling with shadcn/ui + Tailwind

**Always use shadcn/ui for base components:**

```bash
# Install shadcn components
npx shadcn@latest add button input card dialog

# Components are copied to components/ui/
```

```typescript
// Using shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const LoginForm = () => {
  return (
    <Card className="w-96">
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
```

### Code Quality Checklist

**Before Committing:**
- [ ] All functions use Arrow Functions
- [ ] Exports at bottom of file
- [ ] TypeScript types explicitly defined (no `any`)
- [ ] Naming conventions followed (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] GraphQL queries/mutations in separate files
- [ ] Server/Client components correctly designated
- [ ] shadcn/ui components used for UI
- [ ] Comments only for complex logic (code should be self-documenting)

**Detailed Coding Conventions:**

For comprehensive coding standards, refer to:
- TypeScript: `/var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/guidelines/coding-conventions/TYPESCRIPT-CONVENTIONS.md`
- Next.js: `/var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/guidelines/coding-conventions/NEXTJS-CONVENTIONS.md`
- GraphQL: See example in `_docs/99-examples/user-auth-system/06-development/00-coding-conventions.md`

## Variable Substitution During Project Creation

When a project is created from this template, these placeholders are replaced:

**Project Variables**:
- `{{PROJECT_NAME}}` → Actual project name (e.g., "my-web-app")
- `{{PROJECT_DESCRIPTION}}` → Project description
- `{{PROJECT_SN}}` → Project serial number (0-9)
- `${PORT_1}` through `${PORT_9}` → Actual port numbers
- `{PROJECT_DB_NAME}` → Database name

**Platform Variables** (inherited):
- `${MYSQL_HOST}`, `${POSTGRES_HOST}` → Platform database hosts
- `${PLATFORM_NAME}` → Parent platform name
- `${GITHUB_USER}` → GitHub username

**Auto-Generated Secrets**:
- Database credentials (from platform)
- JWT secrets (platform-level)

## Development Workflow

### 1. Starting a New Feature

```bash
# 1. Document requirements
# Edit _docs/01-requirements/02-functional-requirements.md

# 2. Update metadata (if metadata-driven)
# Insert into PostgreSQL metadata tables

# 3. Generate code
cd backend/nodejs
npm run metadata:init

# 4. Implement custom logic
# Create files in src/custom/

# 5. Write tests
# Add tests in src/tests/

# 6. Update API docs
# Update _docs/05-api/
```

### 2. Daily Development

```bash
# Terminal 1: Backend
cd backend/nodejs
npm run dev              # Express on BE_NODEJS_PORT

# Terminal 2: GraphQL (if separate)
npm run graphql:dev      # GraphQL on API_GRAPHQL_PORT

# Terminal 3: Frontend
cd frontend/nextjs
npm run dev              # Next.js on FE_NEXTJS_PORT
```

### 3. Testing

```bash
# Backend unit tests
cd backend/nodejs
npm run test
npm run test:ui          # Visual test runner

# Frontend tests
cd frontend/nextjs
npm run test

# Type checking (both)
npm run type-check
```

### 4. Code Quality

```bash
# Before committing
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript
npm run test             # All tests
```

## Key Integration Points

### GraphQL Server Setup

Located in `backend/nodejs/src/graphql/server.ts`:

```typescript
// Merge generated and custom resolvers
import { typeDefs as generatedTypeDefs } from '@/generated/graphql/typeDefs';
import { resolvers as generatedResolvers } from '@/generated/graphql/resolvers';
import { customResolvers } from '@/custom/resolvers';

const resolvers = {
  Query: {
    ...generatedResolvers.Query,    // Generated CRUD
    ...customResolvers.Query,       // Custom queries (override)
  },
  Mutation: {
    ...generatedResolvers.Mutation,
    ...customResolvers.Mutation,
  },
};

// Context with authentication
context: async ({ req }) => ({
  user: await authenticateUser(req),
  loaders: createDataLoaders(),
})
```

### Express Server Setup

Located in `backend/nodejs/src/index.ts`:
- Health check at `/health`
- API info at `/api`
- Error handling middleware
- CORS configuration from `.env`

### Database Configuration

Located in `backend/nodejs/src/config/database.ts`:
- Supports both MySQL and PostgreSQL
- Connection pooling
- Environment-based configuration

## Common Pitfalls

### ❌ Don't Do This

1. **Hardcode ports** - Always use environment variables
2. **Edit generated files** (`src/generated/`) - Extend via `src/custom/`
3. **Skip documentation** - Update docs with code changes
4. **Ignore file naming conventions** - Follow `*.types.ts`, `*.typeDefs.ts` patterns
5. **Modify template placeholders** - Variables like `{{PROJECT_NAME}}` are substituted during creation
6. **Commit sensitive data** - Never commit `.env` with real credentials
7. **Use function keyword** - All functions must be Arrow Functions
8. **Inline exports** - Always export at bottom of file
9. **Create Korean docs first** - Always create English `.md` first, then `.kr.md`
10. **Skip shadcn/ui** - Always use shadcn/ui + Tailwind for UI components

### ✅ Do This Instead

1. **Reference ports via env vars** - `process.env.BE_NODEJS_PORT`
2. **Extend generated code** - Inheritance pattern in `src/custom/`
3. **Update docs first** - Requirements → Design → Code → Tests → Docs
4. **Follow naming standards** - Use table above for file patterns
5. **Test template substitution** - Verify placeholders after project creation
6. **Use `.env.example`** - Commit examples, not real values
7. **Write Arrow Functions** - `const func = () => {}` everywhere
8. **Export at bottom** - Organize exports in dedicated section
9. **English first, Korean second** - Create `README.md` then `README.kr.md`
10. **Use shadcn/ui** - `npx shadcn@latest add button` for all UI components

## Template Maintenance

When updating this template:

1. **Test substitution variables**: Ensure all `{{VARIABLES}}` and `${VARIABLES}` are correct
2. **Update documentation**: Keep `_docs/` in sync with code changes
3. **Version package.json**: Update dependencies across all packages
4. **Test project creation**: Run `create-project.sh` to verify template works
5. **Update CLAUDE.md**: Keep this file current with architecture changes

## Special Directories

### `_docs/`
Comprehensive documentation system - see `_docs/README.md` for navigation

### `_resources/`
Design assets, mockups, and creative resources

### `_references/`
Benchmarks, inspiration, and external references

### `_backups/`
Metadata and configuration backups

### `_drafts/`
Work-in-progress documents and experiments

## Testing the Template

Before using this template for production projects:

```bash
# 1. Verify all package.json files are valid
cd backend/nodejs && npm install
cd frontend/nextjs && npm install

# 2. Check for template variable consistency
grep -r "{{PROJECT_NAME}}" .
grep -r "\${PORT_" .

# 3. Test TypeScript compilation
npm run type-check

# 4. Review documentation structure
ls -la _docs/
```

## Related Platform Documentation

This template is part of the larger platform system. See parent platform documentation:
- Platform CLAUDE.md: `/var/services/homes/jungsam/dev/dockers/CLAUDE.md`
- Manager API: `/var/services/homes/jungsam/dev/dockers/_manager/api/`
- Port Allocator: `/var/services/homes/jungsam/dev/dockers/_manager/scripts/port-allocator.js`

## Quick Reference

**Template Location**: `/var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/`

**Created Projects Location**: `/var/services/homes/jungsam/dev/dockers/platforms/{platform-name}/projects/{project-name}/`

**Project Creation Script**: `platforms/{platform-name}/projects/create-project.sh`

**Port Range**: 20 ports per project (production offsets 0-9, dev offsets 10-19)

**Primary Documentation**: `_docs/README.md` (start here for any new project)

**Metadata Guide**: `backend/nodejs/METADATA-DRIVEN-STRUCTURE.md`
