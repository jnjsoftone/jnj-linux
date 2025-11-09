# Claude Code Prompts - Development Phase

Most effective prompts for code generation during development (Weeks 3-6).

---

## 🎯 Setup & Configuration

### Prompt: Initialize Next.js + GraphQL Project

```
Initialize a Next.js 15 project with the following setup:

1. **Next.js Configuration**:
   - App Router
   - TypeScript (strict mode)
   - Tailwind CSS
   - src/ directory structure

2. **GraphQL Setup**:
   - Apollo Server
   - GraphQL Code Generator
   - Merged schema pattern

3. **Database**:
   - Prisma ORM
   - PostgreSQL
   - Seed script

4. **Authentication**:
   - JWT with jose library
   - bcrypt for password hashing
   - next-auth or custom implementation

5. **Dev Tools**:
   - ESLint (strict)
   - Prettier
   - Husky (git hooks)

Provide:
- Complete package.json with all dependencies
- tsconfig.json
- next.config.js
- .env.example
- Directory structure
- Setup instructions (npm install → npx prisma generate → npm run dev)

Reference schema: /var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs/99-examples/user-auth-system/04-architecture/02-database-schema.md
```

---

## 🔧 Backend Development

### Prompt: Generate GraphQL Resolvers from Requirements

```
Generate complete GraphQL resolvers for user authentication based on these requirements:

**Requirements**: [paste from 01-requirements/02-functional-requirements.md]

**Database Schema**: [paste Prisma schema]

**Coding Conventions**: [paste from 06-development/00-coding-conventions.md]

For each requirement, generate:

1. **Type Definitions** (GraphQL schema):
   - Input types
   - Output types
   - Mutations/Queries
   - Use domain-centric naming (authUserRegister, not register)

2. **Resolver Implementation**:
   - Zod validation
   - Business logic
   - Database operations with Prisma
   - Error handling with GraphQLError
   - Audit logging

3. **Helper Functions**:
   - Password hashing/verification
   - JWT generation/verification
   - Token rotation
   - Email sending

Generate code for:
- REQ-AUTH-001: authUserRegister
- REQ-AUTH-002: authUserVerifyEmail
- REQ-AUTH-003: authUserLogin
- REQ-AUTH-004: authTokenRefresh
- REQ-AUTH-005: authUserLogout

Use TypeScript strict mode. Include inline comments for complex logic.
```

**Expected Output**: Complete resolver files with type safety

---

### Prompt: Implement JWT Authentication

```
Implement secure JWT authentication system following these specs:

**Requirements**:
- Access token: 15 minutes expiry, contains userId, email, roles
- Refresh token: 7 days expiry, stored in database (can be revoked)
- Token rotation: each refresh generates new refresh token
- Detect token reuse (security alert)

**Implementation needed**:

1. **JWT Helper Functions** (src/lib/auth/jwt.ts):
```typescript
signAccessToken(payload: JWTPayload): string
signRefreshToken(payload: JWTPayload): string
verifyAccessToken(token: string): JWTPayload | null
verifyRefreshToken(token: string): JWTPayload | null
```

2. **Token Storage** (database):
- Save refresh token hash (not plaintext)
- Track device info, IP address
- Mark as revoked when used

3. **Middleware** (GraphQL context):
- Extract token from Authorization header
- Verify token
- Add userId to context
- Handle expired tokens gracefully

4. **Token Refresh Flow**:
- Validate old refresh token
- Check if already used (throw error if replay attack)
- Generate new access + refresh tokens
- Revoke old refresh token
- Return new tokens

Use jose library (not jsonwebtoken) for edge runtime compatibility.
Include error handling for all failure scenarios.
```

---

### Prompt: Implement RBAC Authorization

```
Implement role-based access control system based on this database schema:

[Paste User, Role, Permission, UserRole, RolePermission models from Prisma schema]

Create:

1. **Permission Checker** (src/lib/auth/permissions.ts):
```typescript
async function checkUserPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  // Query user's roles and their permissions
  // Return true if user has permission
}
```

2. **Authorization Decorators**:
```typescript
// Require authentication
requireAuth(resolver)

// Require specific permission
requirePermission(permission: string)

// Require one of multiple permissions
requireAnyPermission(...permissions: string[])

// Require all permissions
requireAllPermissions(...permissions: string[])
```

3. **Usage in Resolvers**:
```typescript
const resolvers = {
  Query: {
    usersList: requirePermission('user:read')(async (_, __, ctx) => {
      return ctx.prisma.user.findMany()
    }),
  },
  Mutation: {
    roleCreate: requirePermission('role:create')(async (_, { input }, ctx) => {
      // Create role
    }),
  },
}
```

4. **Helper Functions**:
```typescript
async function getUserRoles(userId: string): Promise<Role[]>
async function getUserPermissions(userId: string): Promise<Permission[]>
async function assignRoleToUser(userId: string, roleId: string): Promise<void>
```

Use Prisma for database queries. Optimize with `include` to avoid N+1 queries.
Include comprehensive error handling.
```

---

## 🎨 Frontend Development

### Prompt: Generate React Hook Form + Zod Form

```
Create a production-ready LoginForm component with:

**Tech Stack**:
- React Hook Form (useForm)
- Zod validation
- shadcn/ui components
- GraphQL mutation (Apollo Client)
- TypeScript

**Requirements**:
1. **Form Fields**:
   - Email (validated)
   - Password (with show/hide toggle)
   - "Remember me" checkbox
   - Submit button with loading state

2. **Validation**:
   - Zod schema matching backend
   - Real-time validation
   - Show errors below fields

3. **GraphQL Integration**:
```graphql
mutation AuthUserLogin($input: AuthUserLoginInput!) {
  authUserLogin(input: $input) {
    success
    accessToken
    refreshToken
    user {
      id
      email
      firstName
    }
  }
}
```

4. **State Management**:
   - Loading state while submitting
   - Error state (show API errors)
   - Success (redirect to /dashboard)

5. **Accessibility**:
   - ARIA labels
   - Error announcements
   - Keyboard navigation
   - Focus management

Provide complete component code with imports.
Use shadcn/ui Button, Input, Card components.
Reference design system: [path to design system doc]
```

---

### Prompt: Implement Auth Context Provider

```
Create authentication context for Next.js 15 App Router:

**Features**:
1. **State Management**:
   - Current user
   - Loading state
   - Authentication status

2. **Functions**:
```typescript
login(email: string, password: string): Promise<void>
logout(): Promise<void>
refreshToken(): Promise<void>
updateUser(data: Partial<User>): void
```

3. **Token Management**:
   - Store tokens in httpOnly cookies (via API route)
   - Automatic token refresh (when access token expires)
   - Clear tokens on logout

4. **Route Protection**:
```typescript
// Redirect to /login if not authenticated
useRequireAuth()

// Check if user has permission
useRequirePermission('user:read')
```

5. **Auto-refresh Logic**:
   - Decode access token to get expiry
   - Refresh 1 minute before expiry
   - Use setInterval or React effect

Provide:
- AuthProvider component
- useAuth hook
- useRequireAuth hook
- useRequirePermission hook
- Type definitions

Use Apollo Client for GraphQL calls.
Handle edge cases (token expired, refresh failed, network error).
```

---

## 🧪 Testing

### Prompt: Generate Unit Tests for Resolvers

```
Generate comprehensive Jest unit tests for this auth resolver:

[Paste authUserLogin resolver code]

**Test cases to cover**:

1. **Happy Path**:
   - ✅ Login with valid credentials returns tokens
   - ✅ Login updates lastLoginAt timestamp
   - ✅ Login creates audit log entry

2. **Validation Errors**:
   - ❌ Invalid email format
   - ❌ Missing password
   - ❌ Empty fields

3. **Business Logic Errors**:
   - ❌ Email doesn't exist
   - ❌ Wrong password
   - ❌ Unverified account
   - ❌ Disabled account

4. **Security**:
   - ❌ Rate limit exceeded (5 attempts)
   - ❌ Account locked after failures
   - ✅ Failed attempts logged

5. **Edge Cases**:
   - ❌ Database error
   - ❌ JWT signing fails

**Test Structure**:
```typescript
describe('authUserLogin', () => {
  beforeEach(() => {
    // Setup test database
    // Create test user
  })

  afterEach(() => {
    // Cleanup
  })

  it('should login with valid credentials', async () => {
    // Arrange
    // Act
    // Assert
  })

  // ... more tests
})
```

Use:
- Jest + @jest/globals
- Prisma mock or test database
- Supertest for integration tests (optional)

Include mock data setup and teardown.
```

---

### Prompt: Generate E2E Tests (Playwright)

```
Create Playwright E2E tests for complete authentication flow:

**Test Scenarios**:

1. **User Registration Flow**:
```typescript
test('user can register and verify email', async ({ page }) => {
  // Visit /signup
  // Fill form (email, password, name)
  // Submit
  // See "Check your email" message
  // (Mock email service to get verification link)
  // Visit verification link
  // See "Email verified" message
  // Redirected to /login
})
```

2. **Login Flow**:
```typescript
test('user can login with verified account', async ({ page }) => {
  // Given a verified user exists
  // Visit /login
  // Enter credentials
  // Submit
  // Redirected to /dashboard
  // See welcome message with user's name
})
```

3. **Password Reset Flow**:
```typescript
test('user can reset forgotten password', async ({ page }) => {
  // Visit /reset-password
  // Enter email
  // Submit
  // See "Check your email" message
  // (Mock email to get reset link)
  // Visit reset link
  // Enter new password
  // Submit
  // Redirected to /login
  // Can login with new password
})
```

4. **Error Scenarios**:
```typescript
test('shows error for invalid credentials', async ({ page }) => {
  // ... test implementation
})

test('shows error for unverified account', async ({ page }) => {
  // ... test implementation
})
```

Include:
- Page object pattern
- Fixtures for test data
- Helper functions for common actions
- Visual regression tests (screenshots)
```

---

## 🔍 Debugging & Optimization

### Prompt: Debug GraphQL N+1 Query Problem

```
I'm experiencing slow GraphQL queries. Help me optimize:

**Current Resolver**:
```typescript
const resolvers = {
  Query: {
    usersList: async (_, __, ctx) => {
      return ctx.prisma.user.findMany()
    },
  },
  User: {
    roles: async (user, _, ctx) => {
      return ctx.prisma.role.findMany({
        where: {
          users: {
            some: { userId: user.id },
          },
        },
      })
    },
  },
}
```

**Problem**: N+1 queries when fetching users with roles

**Fix needed**:
1. Identify the N+1 issue
2. Use Prisma `include` to eager load
3. Or use DataLoader for batching
4. Show optimized code
5. Explain performance improvement

Provide before/after query counts and response times.
```

---

### Prompt: Add Logging and Monitoring

```
Add comprehensive logging to this auth system:

**Requirements**:

1. **Structured Logging**:
   - JSON format
   - Log levels: INFO, WARN, ERROR
   - Include context (userId, requestId, timestamp)

2. **What to Log**:
   - All authentication attempts (success/failure)
   - Authorization failures
   - Token refresh events
   - Security events (account lockout, suspicious activity)
   - API errors with stack traces

3. **Log Format**:
```typescript
{
  level: 'info',
  message: 'User logged in',
  userId: 'user_123',
  email: 'user@example.com',
  ipAddress: '192.168.1.1',
  timestamp: '2024-10-19T10:30:00Z'
}
```

4. **Performance Logging**:
   - GraphQL resolver execution time
   - Database query duration
   - Slow query alerts (> 100ms)

5. **Privacy**:
   - Never log passwords
   - Hash email in non-essential logs
   - Redact sensitive data

Provide:
- Logger utility (src/lib/logger.ts)
- Middleware to log all GraphQL requests
- Examples of logging in resolvers
- Log rotation strategy
```

---

## 💡 Best Practices

### Context-Rich Prompts

Always provide:
```
I'm implementing [feature] for [project type].

**Tech Stack**: [list]
**Requirements**: [paste or link]
**Coding Conventions**: [paste or link]
**Database Schema**: [paste relevant models]

Generate [specific deliverable] with:
1. [Specific requirement]
2. [Specific requirement]
...

Include:
- TypeScript types
- Error handling
- Tests
- Comments for complex logic
```

### Iterative Refinement

```
# Round 1
"Generate login resolver"
[Review output]

# Round 2
"Add rate limiting to this resolver [paste code]"
[Review output]

# Round 3
"Add comprehensive error handling [paste code]"
[Review output]

# Round 4
"Write tests for this resolver [paste code]"
```

---

## 📚 Related Documents

- [Coding Conventions](./00-coding-conventions.md)
- [Functional Requirements](../01-requirements/02-functional-requirements.md)
- [Database Schema](../04-architecture/02-database-schema.md)
- [GraphQL Design Guide](../../_templates/docker/docker-ubuntu/_docs/api/01-graphql-design.md)
