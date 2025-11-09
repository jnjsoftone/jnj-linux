# Coding Conventions - User Auth System

**Document Status**: ✅ Approved
**Tech Stack**: TypeScript + GraphQL + Next.js + Prisma

---

## 🎯 Core Principles

1. **Type Safety First**: Use TypeScript strict mode
2. **Functional over OOP**: Prefer pure functions
3. **Explicit over Implicit**: Clear naming, no magic
4. **Fail Fast**: Validate early, throw meaningful errors

---

## 📂 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Route group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── api/graphql/route.ts # GraphQL endpoint
├── components/
│   ├── ui/                  # shadcn components
│   ├── forms/               # Form molecules
│   └── auth/                # Auth organisms
├── lib/
│   ├── graphql/
│   │   ├── typeDefs/        # GraphQL type definitions
│   │   │   ├── auth.ts
│   │   │   └── user.ts
│   │   ├── resolvers/       # GraphQL resolvers
│   │   │   ├── auth.ts
│   │   │   └── user.ts
│   │   └── context.ts       # GraphQL context
│   ├── prisma.ts            # Prisma client
│   ├── auth/                # Auth utilities
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── permissions.ts
│   └── validations/         # Zod schemas
│       └── auth.ts
└── types/                   # TypeScript types
    └── graphql.ts
```

---

## 🔤 Naming Conventions

### GraphQL Schema

**Domain-Centric Naming**:
```graphql
# ✅ Good
authUserRegister
authUserLogin
authTokenRefresh
roleCreate
userRoleAssign

# ❌ Bad
register
login
refresh
createRole
assignRole
```

**Pattern**: `{domain}{Entity}{Action}`
- Domain: auth, user, role
- Entity: User, Token, Role
- Action: Register, Login, Create, Update, Delete

### TypeScript Files

```typescript
// Files: kebab-case
auth-resolver.ts
password-helper.ts
user-service.ts

// Interfaces: PascalCase with 'I' prefix (optional)
interface AuthUserLoginInput { }
interface User { }

// Types: PascalCase
type JWTPayload = { }

// Functions: camelCase
async function hashPassword(password: string): Promise<string> { }

// Constants: UPPER_SNAKE_CASE
const JWT_EXPIRY = '15m'
const BCRYPT_ROUNDS = 12
```

### React Components

```typescript
// Components: PascalCase
export function LoginForm() { }
export function PasswordInput() { }

// Hooks: camelCase with 'use' prefix
export function useAuth() { }

// Props: PascalCase with 'Props' suffix
interface LoginFormProps { }
```

---

## 📝 GraphQL Conventions

### Type Definitions

```typescript
// src/lib/graphql/typeDefs/auth.ts
export const authTypeDefs = `#graphql
  """
  Input for user registration
  """
  input AuthUserRegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  """
  Response from authentication mutations
  """
  type AuthResponse {
    success: Boolean!
    message: String
    accessToken: String
    refreshToken: String
    user: User
  }

  type Mutation {
    """
    Register a new user account
    """
    authUserRegister(input: AuthUserRegisterInput!): AuthResponse!

    """
    Login with email and password
    """
    authUserLogin(input: AuthUserLoginInput!): AuthResponse!

    """
    Refresh access token
    """
    authTokenRefresh(refreshToken: String!): AuthResponse!
  }
`
```

**Documentation**: Use GraphQL description strings (""") for all types, fields, and arguments

---

### Resolvers

```typescript
// src/lib/graphql/resolvers/auth.ts
import { GraphQLError } from 'graphql'
import { authUserRegisterSchema } from '@/lib/validations/auth'

export const authResolvers = {
  Mutation: {
    authUserRegister: async (_parent, { input }, context) => {
      // 1. Validate input with Zod
      const validated = authUserRegisterSchema.parse(input)

      // 2. Check business rules
      const existing = await context.prisma.user.findUnique({
        where: { email: validated.email },
      })

      if (existing) {
        throw new GraphQLError('Email already registered', {
          extensions: { code: 'EMAIL_EXISTS' },
        })
      }

      // 3. Perform operation
      const hashedPassword = await hashPassword(validated.password)
      const user = await context.prisma.user.create({
        data: {
          email: validated.email,
          password: hashedPassword,
          firstName: validated.firstName,
          lastName: validated.lastName,
        },
      })

      // 4. Log security event
      await context.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'REGISTER',
          result: 'SUCCESS',
          ipAddress: context.req.ip,
        },
      })

      // 5. Return response
      return {
        success: true,
        message: 'Registration successful. Please check your email.',
        user,
      }
    },
  },
}
```

**Resolver Pattern**:
1. Validate input (Zod)
2. Check business rules
3. Perform database operation
4. Log important events
5. Return typed response

---

## 🛡️ Error Handling

### GraphQL Errors

```typescript
import { GraphQLError } from 'graphql'

// Standard error codes
const ErrorCodes = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_USER_INPUT: 'BAD_USER_INPUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const

// Throw meaningful errors
throw new GraphQLError('Invalid credentials', {
  extensions: {
    code: ErrorCodes.UNAUTHENTICATED,
    field: 'email',
  },
})

// With validation errors
throw new GraphQLError('Validation failed', {
  extensions: {
    code: ErrorCodes.BAD_USER_INPUT,
    validationErrors: zodError.errors,
  },
})
```

### Try-Catch Pattern

```typescript
async function sensitiveOperation() {
  try {
    // Operation
  } catch (error) {
    // Log error with context
    console.error('Operation failed:', {
      error,
      userId: context.userId,
      timestamp: new Date().toISOString(),
    })

    // Return user-friendly error
    throw new GraphQLError('Operation failed. Please try again.', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    })
  }
}
```

---

## ✅ Validation (Zod)

```typescript
// src/lib/validations/auth.ts
import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character')

export const authUserRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
})

export const authUserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Type inference
export type AuthUserRegisterInput = z.infer<typeof authUserRegisterSchema>
```

**Pattern**:
- Define schema with Zod
- Infer TypeScript type from schema
- Use same schema on frontend and backend

---

## 🔐 Security Best Practices

### Password Handling

```typescript
import bcrypt from 'bcrypt'

const BCRYPT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

### JWT Handling

```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRY = '15m'
const REFRESH_EXPIRY = '7d'

interface JWTPayload {
  userId: string
  email: string
  roles: string[]
}

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  })
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}
```

### Authorization Middleware

```typescript
export function requireAuth(resolver: GraphQLResolver) {
  return async (parent, args, context, info) => {
    if (!context.userId) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    }
    return resolver(parent, args, context, info)
  }
}

export function requirePermission(permission: string) {
  return (resolver: GraphQLResolver) => {
    return async (parent, args, context, info) => {
      const hasPermission = await checkUserPermission(
        context.userId,
        permission
      )

      if (!hasPermission) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN', required: permission },
        })
      }

      return resolver(parent, args, context, info)
    }
  }
}

// Usage
const resolvers = {
  Query: {
    usersList: requirePermission('user:read')(async (_, __, context) => {
      return context.prisma.user.findMany()
    }),
  },
}
```

---

## 🧪 Testing Conventions

```typescript
// Naming: {function}.test.ts
// Example: auth-resolver.test.ts

import { describe, it, expect } from '@jest/globals'

describe('authUserLogin', () => {
  it('should login with valid credentials', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'Test@123',
    }

    // Act
    const result = await authUserLogin(input, context)

    // Assert
    expect(result.success).toBe(true)
    expect(result.accessToken).toBeDefined()
  })

  it('should reject invalid credentials', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'WrongPassword',
    }

    // Act & Assert
    await expect(authUserLogin(input, context)).rejects.toThrow(
      'Invalid credentials'
    )
  })
})
```

---

## 📊 Logging

```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }))
  },
  error: (message: string, error: Error, meta?: object) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error.message,
        stack: error.stack,
        ...meta,
      })
    )
  },
}

// Usage
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
})
```

---

## 💡 Code Review Checklist

- [ ] TypeScript strict mode (no `any`)
- [ ] Input validated with Zod
- [ ] Errors have meaningful messages and codes
- [ ] Security events logged to audit_logs
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens signed correctly
- [ ] Authorization checks on protected resolvers
- [ ] GraphQL schema documented
- [ ] Tests for happy path and error cases
- [ ] No sensitive data in logs
- [ ] Environment variables for secrets

---

**Related Documents**:
- [GraphQL Design Guide](../../_templates/docker/docker-ubuntu/_docs/api/01-graphql-design.md)
- [Database Schema](../04-architecture/02-database-schema.md)
- [Security Architecture](../04-architecture/03-security-architecture.md)
