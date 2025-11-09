# Functional Requirements - User Authentication & Authorization System

**Document Status**: ✅ Approved
**Created**: 2024-10-19 (Week 1, Day 1)
**Last Updated**: 2024-10-19
**Owner**: Product Manager

---

## Overview

This document defines **functional requirements** for the User Authentication & Authorization System. Each requirement includes:
- Unique ID for traceability
- Priority level
- Acceptance criteria
- Dependencies

---

## 1. User Registration

### REQ-AUTH-001: User Registration with Email
**Priority**: Critical
**Status**: Approved
**Phase**: 1

#### Description
Users must be able to register a new account using email and password.

#### Acceptance Criteria
- [ ] User provides email, password, firstName, lastName
- [ ] Email must be unique (no duplicate accounts)
- [ ] Password must meet strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- [ ] Password is hashed with bcrypt (cost factor 12)
- [ ] System generates email verification token
- [ ] System sends verification email
- [ ] User account is created but inactive until verified
- [ ] Returns user ID and success message

#### GraphQL Mutation
```graphql
mutation AuthUserRegister($input: AuthUserRegisterInput!) {
  authUserRegister(input: $input) {
    success
    message
    user {
      id
      email
      firstName
      lastName
      isVerified
    }
  }
}
```

#### Error Cases
- Email already exists → "Email already registered"
- Invalid email format → "Invalid email address"
- Weak password → "Password does not meet requirements"
- Email service unavailable → "Registration successful, verification email will be sent shortly"

#### Dependencies
- Email service configured
- Database schema: User table

---

### REQ-AUTH-002: Email Verification
**Priority**: Critical
**Status**: Approved
**Phase**: 1

#### Description
Users must verify their email address before they can login.

#### Acceptance Criteria
- [ ] User receives email with verification link
- [ ] Link contains secure token (UUID, expires in 24 hours)
- [ ] Clicking link marks account as verified
- [ ] Expired tokens show error message
- [ ] User can request new verification email
- [ ] After verification, redirect to login page

#### GraphQL Mutations
```graphql
mutation AuthUserVerifyEmail($token: String!) {
  authUserVerifyEmail(token: $token) {
    success
    message
  }
}

mutation AuthUserResendVerification($email: String!) {
  authUserResendVerification(email: $email) {
    success
    message
  }
}
```

#### Error Cases
- Invalid token → "Verification link is invalid"
- Expired token → "Verification link has expired"
- Already verified → "Email is already verified"

#### Dependencies
- REQ-AUTH-001 (Registration)
- Email service

---

## 2. User Authentication

### REQ-AUTH-003: Login with Email & Password
**Priority**: Critical
**Status**: Approved
**Phase**: 1

#### Description
Verified users can login with email and password to receive JWT tokens.

#### Acceptance Criteria
- [ ] User provides email and password
- [ ] System validates credentials
- [ ] Only verified users can login
- [ ] Returns access token (JWT, expires in 15 minutes)
- [ ] Returns refresh token (JWT, expires in 7 days)
- [ ] Access token contains: userId, email, roles
- [ ] Refresh token stored in database
- [ ] Updates lastLoginAt timestamp
- [ ] Records login attempt in audit log

#### GraphQL Mutation
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
      lastName
      roles {
        id
        name
      }
    }
  }
}
```

#### Error Cases
- Invalid credentials → "Invalid email or password"
- Unverified email → "Please verify your email before logging in"
- Account locked → "Account has been locked due to multiple failed login attempts"
- Rate limit exceeded → "Too many login attempts, please try again later"

#### Security Requirements
- Rate limiting: 5 failed attempts per email per 15 minutes
- Password comparison using bcrypt
- Account locked after 10 failed attempts within 1 hour

#### Dependencies
- REQ-AUTH-002 (Email Verification)
- Database schema: User, RefreshToken tables

---

### REQ-AUTH-004: Token Refresh
**Priority**: Critical
**Status**: Approved
**Phase**: 1

#### Description
Users can refresh their access token using a valid refresh token.

#### Acceptance Criteria
- [ ] User provides refresh token
- [ ] System validates refresh token
- [ ] System checks if token is not revoked
- [ ] Returns new access token (15 min expiry)
- [ ] Returns new refresh token (7 days expiry)
- [ ] Old refresh token is revoked
- [ ] Token rotation prevents replay attacks

#### GraphQL Mutation
```graphql
mutation AuthTokenRefresh($refreshToken: String!) {
  authTokenRefresh(refreshToken: $refreshToken) {
    success
    accessToken
    refreshToken
  }
}
```

#### Error Cases
- Invalid token → "Invalid refresh token"
- Expired token → "Refresh token has expired, please login again"
- Revoked token → "Token has been revoked, please login again"

#### Security Requirements
- Refresh token rotation (one-time use)
- Revoke old token immediately
- Detect token reuse (possible attack)

---

### REQ-AUTH-005: Logout
**Priority**: High
**Status**: Approved
**Phase**: 1

#### Description
Users can logout, which revokes their refresh token.

#### Acceptance Criteria
- [ ] User provides refresh token
- [ ] System revokes refresh token
- [ ] Client must delete access token
- [ ] Returns success confirmation

#### GraphQL Mutation
```graphql
mutation AuthUserLogout($refreshToken: String!) {
  authUserLogout(refreshToken: $refreshToken) {
    success
    message
  }
}
```

#### Client-Side Actions
- Delete access token from memory
- Delete refresh token from storage
- Clear user state
- Redirect to login page

---

## 3. Password Management

### REQ-AUTH-006: Password Reset Request
**Priority**: High
**Status**: Approved
**Phase**: 1

#### Description
Users who forgot their password can request a password reset email.

#### Acceptance Criteria
- [ ] User provides email address
- [ ] System generates secure reset token (UUID, expires in 1 hour)
- [ ] System sends reset email with link
- [ ] Token is single-use only
- [ ] Returns success (even if email doesn't exist - prevent enumeration)

#### GraphQL Mutation
```graphql
mutation AuthPasswordResetRequest($email: String!) {
  authPasswordResetRequest(email: $email) {
    success
    message
  }
}
```

#### Security Requirements
- Rate limiting: 3 reset requests per email per hour
- Return same response whether email exists or not
- Token stored as hash in database

#### Dependencies
- Email service

---

### REQ-AUTH-007: Password Reset Confirmation
**Priority**: High
**Status**: Approved
**Phase**: 1

#### Description
Users can set a new password using the reset token.

#### Acceptance Criteria
- [ ] User provides reset token and new password
- [ ] System validates token
- [ ] New password meets strength requirements
- [ ] Password is hashed with bcrypt
- [ ] Reset token is consumed (single-use)
- [ ] All existing refresh tokens are revoked
- [ ] User must login again with new password

#### GraphQL Mutation
```graphql
mutation AuthPasswordResetConfirm($input: AuthPasswordResetConfirmInput!) {
  authPasswordResetConfirm(input: $input) {
    success
    message
  }
}
```

#### Error Cases
- Invalid token → "Invalid or expired reset link"
- Expired token → "Reset link has expired, please request a new one"
- Weak password → "Password does not meet requirements"
- Token already used → "Reset link has already been used"

---

### REQ-AUTH-008: Password Change (Authenticated)
**Priority**: Medium
**Status**: Approved
**Phase**: 1

#### Description
Authenticated users can change their password.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User provides current password and new password
- [ ] System validates current password
- [ ] New password meets strength requirements
- [ ] New password is different from current password
- [ ] All refresh tokens except current are revoked
- [ ] Returns success confirmation

#### GraphQL Mutation
```graphql
mutation AuthPasswordChange($input: AuthPasswordChangeInput!) {
  authPasswordChange(input: $input) {
    success
    message
  }
}
```

#### Error Cases
- Wrong current password → "Current password is incorrect"
- Same password → "New password must be different from current password"

---

## 4. User Profile Management

### REQ-AUTH-009: Get Current User Profile
**Priority**: High
**Status**: Approved
**Phase**: 1

#### Description
Authenticated users can retrieve their profile information.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] Returns user ID, email, name, roles, permissions
- [ ] Does not return password hash
- [ ] Includes account metadata (createdAt, lastLoginAt)

#### GraphQL Query
```graphql
query AuthUserMe {
  authUserMe {
    id
    email
    firstName
    lastName
    isVerified
    roles {
      id
      name
      permissions {
        id
        name
        resource
        action
      }
    }
    createdAt
    lastLoginAt
  }
}
```

---

### REQ-AUTH-010: Update User Profile
**Priority**: Medium
**Status**: Approved
**Phase**: 1

#### Description
Authenticated users can update their profile information.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] Can update: firstName, lastName
- [ ] Cannot update: email, password (separate operations)
- [ ] Returns updated user object
- [ ] Validates input data

#### GraphQL Mutation
```graphql
mutation AuthUserUpdateProfile($input: AuthUserUpdateProfileInput!) {
  authUserUpdateProfile(input: $input) {
    success
    user {
      id
      firstName
      lastName
    }
  }
}
```

---

## 5. Role Management

### REQ-AUTH-011: List All Roles
**Priority**: High
**Status**: Approved
**Phase**: 2

#### Description
Administrators can view all available roles in the system.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User must have "role:read" permission
- [ ] Returns all roles with their permissions
- [ ] Supports pagination

#### GraphQL Query
```graphql
query RolesList($limit: Int, $offset: Int) {
  rolesList(limit: $limit, offset: $offset) {
    total
    roles {
      id
      name
      description
      permissions {
        id
        name
        resource
        action
      }
      createdAt
    }
  }
}
```

#### Authorization
- Requires permission: `role:read`

---

### REQ-AUTH-012: Create Role
**Priority**: High
**Status**: Approved
**Phase**: 2

#### Description
Administrators can create new roles with specific permissions.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User must have "role:create" permission
- [ ] Role name must be unique
- [ ] Can assign multiple permissions to role
- [ ] Returns created role object

#### GraphQL Mutation
```graphql
mutation RoleCreate($input: RoleCreateInput!) {
  roleCreate(input: $input) {
    success
    role {
      id
      name
      description
      permissions {
        id
        name
      }
    }
  }
}
```

#### Error Cases
- Duplicate role name → "Role with this name already exists"
- Invalid permission IDs → "One or more permissions do not exist"

#### Authorization
- Requires permission: `role:create`

---

### REQ-AUTH-013: Assign Role to User
**Priority**: Critical
**Status**: Approved
**Phase**: 2

#### Description
Administrators can assign roles to users.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User must have "user:update" permission
- [ ] Can assign multiple roles to a user
- [ ] Can remove roles from a user
- [ ] Returns updated user object with roles

#### GraphQL Mutation
```graphql
mutation UserRoleAssign($userId: ID!, $roleIds: [ID!]!) {
  userRoleAssign(userId: $userId, roleIds: $roleIds) {
    success
    user {
      id
      email
      roles {
        id
        name
      }
    }
  }
}
```

#### Authorization
- Requires permission: `user:update`

---

## 6. Permission Management

### REQ-AUTH-014: List All Permissions
**Priority**: Medium
**Status**: Approved
**Phase**: 2

#### Description
Administrators can view all available permissions.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User must have "permission:read" permission
- [ ] Returns all permissions grouped by resource
- [ ] Shows permission name, resource, action

#### GraphQL Query
```graphql
query PermissionsList {
  permissionsList {
    permissions {
      id
      name
      resource
      action
      description
    }
  }
}
```

---

### REQ-AUTH-015: Check User Permission
**Priority**: Critical
**Status**: Approved
**Phase**: 2

#### Description
System can check if a user has a specific permission.

#### Acceptance Criteria
- [ ] Given userId and permission name
- [ ] Returns true/false
- [ ] Checks direct role permissions
- [ ] Used by GraphQL resolvers for authorization

#### GraphQL Query
```graphql
query PermissionCheck($permission: String!) {
  permissionCheck(permission: $permission) {
    hasPermission
  }
}
```

#### Implementation Detail
- This is primarily used server-side
- Client can use it for UI rendering decisions
- Not a replacement for server-side authorization

---

## 7. Session Management

### REQ-AUTH-016: List User Sessions
**Priority**: Medium
**Status**: Approved
**Phase**: 3

#### Description
Users can view all active sessions (devices where they're logged in).

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] Returns all active refresh tokens for user
- [ ] Shows device info, IP address, last used time
- [ ] Marks current session

#### GraphQL Query
```graphql
query AuthUserSessions {
  authUserSessions {
    sessions {
      id
      deviceInfo
      ipAddress
      lastUsedAt
      createdAt
      isCurrent
    }
  }
}
```

---

### REQ-AUTH-017: Revoke User Session
**Priority**: Medium
**Status**: Approved
**Phase**: 3

#### Description
Users can revoke a specific session (logout from another device).

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] Can revoke any of their own sessions
- [ ] Cannot revoke another user's sessions
- [ ] Refresh token is revoked
- [ ] Returns success confirmation

#### GraphQL Mutation
```graphql
mutation AuthSessionRevoke($sessionId: ID!) {
  authSessionRevoke(sessionId: $sessionId) {
    success
    message
  }
}
```

---

## 8. Admin Operations

### REQ-AUTH-018: Admin - List All Users
**Priority**: Medium
**Status**: Approved
**Phase**: 2

#### Description
Administrators can view all users in the system.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User must have "user:read" permission
- [ ] Returns paginated user list
- [ ] Supports filtering (email, verified status, role)
- [ ] Does not return password hashes

#### GraphQL Query
```graphql
query UsersList($filter: UsersFilterInput, $limit: Int, $offset: Int) {
  usersList(filter: $filter, limit: $limit, offset: $offset) {
    total
    users {
      id
      email
      firstName
      lastName
      isVerified
      roles {
        id
        name
      }
      createdAt
      lastLoginAt
    }
  }
}
```

#### Authorization
- Requires permission: `user:read`

---

### REQ-AUTH-019: Admin - Disable/Enable User Account
**Priority**: Medium
**Status**: Approved
**Phase**: 2

#### Description
Administrators can disable or enable user accounts.

#### Acceptance Criteria
- [ ] User must be authenticated
- [ ] User must have "user:update" permission
- [ ] Can disable user account (prevents login)
- [ ] Can re-enable disabled account
- [ ] Disabling revokes all refresh tokens
- [ ] Returns updated user status

#### GraphQL Mutation
```graphql
mutation UserAccountSetStatus($userId: ID!, $isActive: Boolean!) {
  userAccountSetStatus(userId: $userId, isActive: $isActive) {
    success
    user {
      id
      email
      isActive
    }
  }
}
```

#### Authorization
- Requires permission: `user:update`

---

## 9. Audit & Logging

### REQ-AUTH-020: Security Audit Log
**Priority**: High
**Status**: Approved
**Phase**: 3

#### Description
System logs all security-relevant events for audit purposes.

#### Events to Log
- User registration
- Email verification (success/failure)
- Login attempts (success/failure)
- Logout
- Password reset requests
- Password changes
- Role assignments
- Permission checks (denied only)
- Account status changes

#### Log Fields
- Event type
- User ID (if applicable)
- Email (if applicable)
- IP address
- User agent
- Timestamp
- Success/Failure
- Error message (if failure)

#### Retention
- Security logs retained for 1 year
- Logs are write-only (cannot be modified)

---

## Requirements Traceability Matrix

| Requirement | Phase | Priority | Dependencies | Test Cases |
|-------------|-------|----------|--------------|------------|
| REQ-AUTH-001 | 1 | Critical | Database | TC-001-TC-005 |
| REQ-AUTH-002 | 1 | Critical | REQ-AUTH-001, Email | TC-006-TC-009 |
| REQ-AUTH-003 | 1 | Critical | REQ-AUTH-002 | TC-010-TC-015 |
| REQ-AUTH-004 | 1 | Critical | REQ-AUTH-003 | TC-016-TC-020 |
| REQ-AUTH-005 | 1 | High | REQ-AUTH-003 | TC-021-TC-023 |
| REQ-AUTH-006 | 1 | High | Email | TC-024-TC-026 |
| REQ-AUTH-007 | 1 | High | REQ-AUTH-006 | TC-027-TC-031 |
| REQ-AUTH-008 | 1 | Medium | REQ-AUTH-003 | TC-032-TC-035 |
| REQ-AUTH-009 | 1 | High | REQ-AUTH-003 | TC-036-TC-038 |
| REQ-AUTH-010 | 1 | Medium | REQ-AUTH-003 | TC-039-TC-042 |
| REQ-AUTH-011 | 2 | High | Database | TC-043-TC-045 |
| REQ-AUTH-012 | 2 | High | REQ-AUTH-011 | TC-046-TC-049 |
| REQ-AUTH-013 | 2 | Critical | REQ-AUTH-012 | TC-050-TC-053 |
| REQ-AUTH-014 | 2 | Medium | Database | TC-054-TC-055 |
| REQ-AUTH-015 | 2 | Critical | REQ-AUTH-013 | TC-056-TC-060 |
| REQ-AUTH-016 | 3 | Medium | REQ-AUTH-003 | TC-061-TC-063 |
| REQ-AUTH-017 | 3 | Medium | REQ-AUTH-016 | TC-064-TC-066 |
| REQ-AUTH-018 | 2 | Medium | REQ-AUTH-013 | TC-067-TC-070 |
| REQ-AUTH-019 | 2 | Medium | REQ-AUTH-013 | TC-071-TC-074 |
| REQ-AUTH-020 | 3 | High | All | TC-075-TC-080 |

---

## Related Documents

- [Project Overview](./01-project-overview.md)
- [Non-Functional Requirements](./03-non-functional-requirements.md)
- [User Stories](../03-planning/03-user-stories/auth-user-stories.md)
- [GraphQL Schema](../05-api/01-graphql-schema.md)
- [Test Cases](../07-testing/test-cases/auth-test-cases.md)

---

**Document Status**: Ready for development
**Next Review**: End of Sprint 1
**Total Requirements**: 20 functional requirements
