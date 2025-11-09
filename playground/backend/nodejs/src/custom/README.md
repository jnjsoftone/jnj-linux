# Custom Code Directory

> ✏️ **YOUR CODE GOES HERE**

This directory contains custom business logic that extends or supplements generated code.

## Directory Structure

```
custom/
├── resolvers/          # Custom GraphQL resolvers
│   ├── auth.resolver.ts        # Authentication (register, login)
│   └── user.resolver.ts        # Extended user operations
│
├── services/           # Custom business logic services
│   ├── AuthService.ts          # Authentication logic
│   └── PermissionService.ts    # Authorization logic
│
├── middleware/         # Middleware functions
│   ├── authentication.ts       # JWT verification
│   ├── authorization.ts        # Permission checking
│   └── rateLimiter.ts          # Rate limiting
│
├── validators/         # Custom validation logic
│   └── userValidator.ts
│
└── dataloaders/        # DataLoader instances (N+1 prevention)
    └── userLoader.ts
```

## Usage

### Extending Generated Services

```typescript
// custom/services/UserService.ts
import { UserService as GeneratedUserService } from '@/generated/services/UserService';

export class UserService extends GeneratedUserService {
  // Inherits: create(), update(), delete(), findById(), etc.

  // Add custom methods
  async registerUser(input: RegisterInput) {
    // Custom registration logic
  }

  async searchUsers(query: string) {
    // Custom search logic
  }
}
```

### Custom Resolvers

```typescript
// custom/resolvers/auth.resolver.ts
import { authService } from '../services/AuthService';

export const authResolvers = {
  Mutation: {
    register: async (_, { input }) => {
      return authService.register(input);
    },
    login: async (_, { input }) => {
      return authService.login(input);
    },
  },
};
```

### Middleware

```typescript
// custom/middleware/authentication.ts
import jwt from 'jsonwebtoken';

export async function authenticateUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

## Best Practices

1. **Separation of Concerns**: Keep business logic in services, not resolvers
2. **Type Safety**: Import and use generated types
3. **Reusability**: Create utility functions for common operations
4. **Testing**: Write tests in `tests/` directory
5. **Documentation**: Comment complex business logic

## See Also

- [METADATA-DRIVEN-STRUCTURE.md](../METADATA-DRIVEN-STRUCTURE.md) - Complete guide
- [generated/README.md](../generated/README.md) - Generated code reference
