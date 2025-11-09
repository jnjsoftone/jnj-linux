# Database Schema - User Authentication System

**Document Status**: ✅ Approved
**Created**: 2024-10-19 (Week 2, Day 6)
**Database**: PostgreSQL 14+
**ORM**: Prisma

---

## Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  firstName String
  lastName  String
  isVerified Boolean @default(false)
  isActive   Boolean @default(true)

  // Verification
  verificationToken   String?   @unique
  verificationExpires DateTime?

  // Password Reset
  resetToken          String?   @unique
  resetTokenExpires   DateTime?

  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  lastLoginAt DateTime?

  // Relations
  roles          UserRole[]
  refreshTokens  RefreshToken[]
  auditLogs      AuditLog[]

  @@index([email])
  @@index([verificationToken])
  @@index([resetToken])
  @@map("users")
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================

model Role {
  id          String   @id @default(cuid())
  name        String   @unique  // "admin", "user", "moderator"
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  users       UserRole[]
  permissions RolePermission[]

  @@index([name])
  @@map("roles")
}

model Permission {
  id          String   @id @default(cuid())
  name        String   @unique  // "user:read", "user:create", "role:update"
  resource    String   // "user", "role", "permission"
  action      String   // "create", "read", "update", "delete"
  description String?
  createdAt   DateTime @default(now())

  // Relations
  roles RolePermission[]

  @@unique([resource, action])
  @@index([name])
  @@map("permissions")
}

// Junction table: User <-> Role (many-to-many)
model UserRole {
  id        String   @id @default(cuid())
  userId    String
  roleId    String
  assignedAt DateTime @default(now())
  assignedBy String?  // Admin who assigned the role

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
  @@map("user_roles")
}

// Junction table: Role <-> Permission (many-to-many)
model RolePermission {
  id           String   @id @default(cuid())
  roleId       String
  permissionId String
  createdAt    DateTime @default(now())

  // Relations
  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
  @@map("role_permissions")
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique  // JWT token (hashed)
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  revokedAt DateTime?

  // Device info
  deviceInfo String?
  ipAddress  String?
  userAgent  String?

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("refresh_tokens")
}

// ============================================================================
// AUDIT & SECURITY
// ============================================================================

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  email     String?
  action    String   // "LOGIN", "LOGOUT", "REGISTER", "PASSWORD_RESET"
  resource  String?  // "user", "role"
  result    String   // "SUCCESS", "FAILURE"
  errorMessage String?
  ipAddress String?
  userAgent String?
  metadata  Json?    // Additional context
  createdAt DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: { name: 'user:create', resource: 'user', action: 'create' },
    }),
    prisma.permission.create({
      data: { name: 'user:read', resource: 'user', action: 'read' },
    }),
    prisma.permission.create({
      data: { name: 'user:update', resource: 'user', action: 'update' },
    }),
    prisma.permission.create({
      data: { name: 'user:delete', resource: 'user', action: 'delete' },
    }),
    prisma.permission.create({
      data: { name: 'role:create', resource: 'role', action: 'create' },
    }),
    prisma.permission.create({
      data: { name: 'role:read', resource: 'role', action: 'read' },
    }),
    prisma.permission.create({
      data: { name: 'role:update', resource: 'role', action: 'update' },
    }),
    prisma.permission.create({
      data: { name: 'role:delete', resource: 'role', action: 'delete' },
    }),
  ])

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Full system access',
    },
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Standard user access',
    },
  })

  // Assign permissions to admin role (all permissions)
  await Promise.all(
    permissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  )

  // Assign read-only permissions to user role
  const userPermissions = permissions.filter(p => p.action === 'read')
  await Promise.all(
    userPermissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      })
    )
  )

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      isActive: true,
    },
  })

  // Assign admin role to admin user
  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  })

  console.log('✅ Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed
```

---

## Index Strategy

| Table | Index | Reason |
|-------|-------|--------|
| users | email | Login lookup |
| users | verificationToken | Email verification |
| users | resetToken | Password reset |
| refresh_tokens | token | Token validation |
| refresh_tokens | userId | User's sessions |
| refresh_tokens | expiresAt | Cleanup expired tokens |
| audit_logs | userId | User activity lookup |
| audit_logs | createdAt | Time-based queries |

---

## Related Documents

- [System Architecture](./01-system-architecture.md)
- [Security Architecture](./03-security-architecture.md)
- [API Schema](../05-api/01-graphql-schema.md)
