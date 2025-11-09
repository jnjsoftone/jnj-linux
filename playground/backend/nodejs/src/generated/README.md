# Generated Code Directory

> 🔒 **DO NOT EDIT FILES IN THIS DIRECTORY**

This directory contains auto-generated code from metadata. Any manual changes will be overwritten when code generation runs.

## Directory Structure

```
generated/
├── types/              # TypeScript types from metadata
├── graphql/            # GraphQL type definitions and resolvers
│   ├── typeDefs/       # GraphQL SDL (Schema Definition Language)
│   └── resolvers/      # Basic CRUD resolvers
├── services/           # Basic service layer (CRUD operations)
└── database/           # Database migrations
    └── migrations/     # DDL migration files
```

## Code Generation

Generate code from metadata:

```bash
npm run generate:all           # Generate all code
npm run generate:types         # Generate TypeScript types only
npm run generate:graphql       # Generate GraphQL schema and resolvers
npm run generate:services      # Generate service layer
npm run generate:migrations    # Generate database migrations
```

## Extending Generated Code

**DO NOT** modify files in this directory. Instead:

1. Import generated code in `custom/` directory
2. Extend using inheritance or composition
3. See [METADATA-DRIVEN-STRUCTURE.md](../METADATA-DRIVEN-STRUCTURE.md) for examples

**Example:**
```typescript
// ✅ Correct: Extend in custom/
import { UserService as GeneratedUserService } from '@/generated/services';

export class UserService extends GeneratedUserService {
  // Add custom methods
}
```

```typescript
// ❌ Wrong: Edit generated file directly
// generated/services/UserService.ts
export class UserService {
  // This will be overwritten!
}
```

## Version Control

You may choose to:
- **Include** in Git: Faster CI/CD, easier code review
- **Exclude** from Git: Cleaner history, no merge conflicts

See `.gitignore.metadata-driven` for recommendations.
