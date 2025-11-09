# Configuration Directory

Configuration files for various services and environments.

## Files

- `database.ts` - Database connection configuration
- `apollo.ts` - Apollo Server configuration (create when needed)
- `environment.ts` - Environment variable management (create when needed)

## Usage

### Database Configuration

```typescript
// config/database.ts
import { createPool } from './database';

const pool = await createPool();
```

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb

# Server
PORT=4000
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

## Best Practices

1. **Never commit** `.env` files with real credentials
2. **Use** `.env.example` as template
3. **Validate** environment variables on startup
4. **Separate** configurations by environment (dev, staging, prod)
