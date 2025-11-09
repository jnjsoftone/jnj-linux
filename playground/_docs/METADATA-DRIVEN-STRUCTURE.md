# 메타데이터 기반 개발 - Backend 디렉토리 구조 가이드

> Node.js + TypeScript + GraphQL 백엔드를 메타데이터 기반으로 개발할 때의 디렉토리 구조 및 코드 배치 가이드

## 📋 목차

1. [핵심 원칙](#핵심-원칙)
2. [명명 규칙](#명명-규칙)
3. [디렉토리 구조](#디렉토리-구조)
4. [코드 배치 규칙](#코드-배치-규칙)
5. [실전 예제](#실전-예제)
6. [Best Practices](#best-practices)

---

## 핵심 원칙

### 1. 생성 코드 vs 커스텀 코드 분리

메타데이터 기반 개발의 가장 중요한 원칙은 **자동 생성 코드와 커스텀 코드의 명확한 분리**입니다.

```
✅ 올바른 방법: 확장 패턴 사용
❌ 잘못된 방법: 생성 파일 직접 수정
```

### 2. Single Source of Truth

PostgreSQL 메타데이터 DB가 모든 스키마 정보의 유일한 출처입니다.

```
Metadata DB → Code Generation → Application Code
```

### 3. 절대 수정 금지 구역

`src/generated/` 디렉토리의 모든 파일은 **절대 수정하지 않습니다**. 메타데이터 변경 시 자동으로 재생성됩니다.

---

## 명명 규칙

메타데이터 기반 개발에서는 **일관된 명명 규칙**이 매우 중요합니다. 디렉토리명과 파일명이 일치해야 코드의 가독성과 유지보수성이 향상됩니다.

### 파일 명명 규칙 정리표

| 디렉토리 | 파일 패턴 | 예시 | 설명 |
|---------|----------|------|------|
| `types/` | `*.types.ts` | `user.types.ts` | TypeScript 인터페이스/타입 정의 |
| `typeDefs/` | `*.typeDefs.ts` | `user.typeDefs.ts` | GraphQL SDL (Schema Definition Language) |
| `resolvers/` | `*.resolver.ts` | `user.resolver.ts` | GraphQL 리졸버 함수 |
| `services/` | `*Service.ts` | `UserService.ts` | 서비스 클래스 (PascalCase) |
| `middleware/` | `*.ts` | `authentication.ts` | 미들웨어 함수 (camelCase) |
| `validators/` | `*.validator.ts` | `user.validator.ts` | 검증 로직 |
| `dataloaders/` | `*.loader.ts` | `user.loader.ts` | DataLoader 인스턴스 |
| `migrations/` | `###_*.sql` | `001_create_users.sql` | DB 마이그레이션 (순번 포함) |

### 명명 규칙 설명

#### 1. **TypeScript 타입**: `*.types.ts`
```typescript
// src/generated/types/user.types.ts
export interface User { ... }
export interface CreateUserInput { ... }
```

#### 2. **GraphQL Type Definitions**: `*.typeDefs.ts` ✅ 추천
```typescript
// src/generated/graphql/typeDefs/user.typeDefs.ts
import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User { ... }
`;
```

**왜 `.typeDefs.ts`인가?**
- ✅ 디렉토리명(`typeDefs/`)과 일치
- ✅ Apollo Server 공식 패턴 (`const typeDefs = ...`)
- ✅ TypeScript 타입(`*.types.ts`)과 명확히 구분
- ✅ 검색 및 자동완성 편의성

**대안 비교**:
```
❌ user.schema.ts     - 디렉토리는 typeDefs인데 파일은 schema (불일치)
⚠️ user.type.ts       - TypeScript 타입 파일과 혼동 가능
✅ user.typeDefs.ts   - 명확하고 일관성 있음
```

#### 3. **Resolvers**: `*.resolver.ts`
```typescript
// src/generated/graphql/resolvers/user.resolver.ts
export const userResolvers = { ... };
```

#### 4. **Services**: `*Service.ts` (PascalCase)
```typescript
// src/generated/services/UserService.ts
export class UserService { ... }
```

#### 5. **Migrations**: `###_description.sql`
```sql
-- src/generated/database/migrations/001_create_users.sql
CREATE TABLE users (...);
```

---

## 디렉토리 구조

### 전체 구조

```
backend/nodejs/
├── src/
│   ├── generated/              # 🔒 자동 생성 코드 (절대 수정 금지)
│   │   ├── types/              # TypeScript 타입 정의
│   │   │   ├── index.ts        # 전체 타입 export
│   │   │   ├── user.types.ts   # User 관련 타입
│   │   │   ├── role.types.ts   # Role 관련 타입
│   │   │   └── ...             # 기타 엔티티별 타입
│   │   │
│   │   ├── graphql/            # GraphQL 관련 생성 코드
│   │   │   ├── typeDefs/       # GraphQL Type Definitions (SDL)
│   │   │   │   ├── index.ts    # 통합 typeDefs
│   │   │   │   ├── user.typeDefs.ts
│   │   │   │   ├── role.typeDefs.ts
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── resolvers/      # 기본 CRUD 리졸버
│   │   │       ├── index.ts    # 통합 리졸버
│   │   │       ├── user.resolver.ts
│   │   │       ├── role.resolver.ts
│   │   │       └── ...
│   │   │
│   │   ├── services/           # 기본 서비스 레이어
│   │   │   ├── index.ts
│   │   │   ├── UserService.ts  # CRUD 메서드만
│   │   │   ├── RoleService.ts
│   │   │   └── ...
│   │   │
│   │   └── database/           # 데이터베이스 관련
│   │       ├── migrations/     # DDL 마이그레이션
│   │       │   ├── 001_create_users.sql
│   │       │   ├── 002_create_roles.sql
│   │       │   └── ...
│   │       │
│   │       └── models/         # 데이터 모델 (선택적)
│   │           ├── User.model.ts
│   │           └── ...
│   │
│   ├── custom/                 # ✏️ 커스텀 코드 (개발자가 작성)
│   │   ├── resolvers/          # 확장된 리졸버
│   │   │   ├── auth.resolver.ts        # 인증 관련 (register, login)
│   │   │   ├── user.resolver.ts        # User 확장 리졸버
│   │   │   ├── admin.resolver.ts       # 관리자 전용 리졸버
│   │   │   └── index.ts                # 통합 export
│   │   │
│   │   ├── services/           # 확장된 서비스
│   │   │   ├── AuthService.ts          # 인증 로직
│   │   │   ├── UserService.ts          # 생성 서비스 확장
│   │   │   ├── PermissionService.ts    # 권한 체크
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/         # 미들웨어
│   │   │   ├── authentication.ts       # JWT 검증
│   │   │   ├── authorization.ts        # 권한 체크
│   │   │   ├── rateLimiter.ts          # Rate limiting
│   │   │   ├── errorHandler.ts         # 에러 핸들링
│   │   │   └── index.ts
│   │   │
│   │   ├── validators/         # 커스텀 검증 로직
│   │   │   ├── userValidator.ts
│   │   │   └── index.ts
│   │   │
│   │   └── dataloaders/        # DataLoader (N+1 방지)
│   │       ├── userLoader.ts
│   │       └── index.ts
│   │
│   ├── config/                 # 설정 파일
│   │   ├── database.ts         # DB 연결 설정
│   │   ├── apollo.ts           # Apollo Server 설정
│   │   ├── environment.ts      # 환경 변수 관리
│   │   └── index.ts
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── logger.ts           # 로깅
│   │   ├── crypto.ts           # 암호화/해시
│   │   ├── dateUtils.ts        # 날짜 처리
│   │   └── index.ts
│   │
│   ├── tests/                  # 테스트 파일
│   │   ├── integration/        # 통합 테스트
│   │   │   ├── auth.test.ts
│   │   │   ├── user.test.ts
│   │   │   └── ...
│   │   │
│   │   ├── unit/               # 단위 테스트
│   │   │   ├── services/
│   │   │   ├── resolvers/
│   │   │   └── ...
│   │   │
│   │   └── helpers/            # 테스트 헬퍼
│   │       ├── testDb.ts
│   │       └── mockData.ts
│   │
│   └── index.ts                # 애플리케이션 엔트리 포인트
│
├── scripts/                    # 빌드/배포 스크립트
│   ├── generate-code.ts        # 코드 생성 스크립트
│   ├── migrate.ts              # 마이그레이션 실행
│   └── seed.ts                 # 시드 데이터
│
├── dist/                       # 컴파일된 JavaScript (gitignore)
├── node_modules/               # 의존성 (gitignore)
├── package.json
├── tsconfig.json
├── .swcrc
├── .env.example
├── .gitignore
└── README.md
```

---

## 코드 배치 규칙

### 1. `src/generated/` - 자동 생성 코드

**규칙**:
- ✅ 메타데이터에서 자동 생성
- ✅ 코드 생성 스크립트가 관리
- ❌ 개발자가 직접 수정 금지
- ❌ Git에 커밋하지 않음 (선택적)

**포함 내용**:
- PostgreSQL 메타데이터에서 생성된 TypeScript 타입
- GraphQL Type Definitions (SDL)
- 기본 CRUD 리졸버
- 기본 서비스 레이어
- 데이터베이스 마이그레이션 파일

**명명 규칙**:
- TypeScript 타입: `*.types.ts` (예: `user.types.ts`)
- GraphQL typeDefs: `*.typeDefs.ts` (예: `user.typeDefs.ts`)
- Resolvers: `*.resolver.ts` (예: `user.resolver.ts`)
- Services: `*Service.ts` (예: `UserService.ts`)
- Migrations: `###_*.sql` (예: `001_create_users.sql`)

**예시**: `src/generated/types/user.types.ts`
```typescript
// 🔒 자동 생성됨 - 수정하지 마세요!
// Generated from metadata at 2024-10-19T12:00:00Z

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
}
```

---

### 2. `src/custom/` - 커스텀 코드

**규칙**:
- ✅ 개발자가 직접 작성
- ✅ 비즈니스 로직 구현
- ✅ 생성 코드를 상속/확장
- ✅ Git에 커밋

**포함 내용**:
- 커스텀 비즈니스 로직
- 인증/권한 로직
- 복잡한 쿼리
- 외부 API 연동
- 커스텀 검증

**예시**: `src/custom/services/UserService.ts`
```typescript
// ✏️ 커스텀 코드 - 자유롭게 수정 가능

import { UserService as GeneratedUserService } from '@/generated/services/UserService';
import { AuthService } from './AuthService';
import { PermissionService } from './PermissionService';

export class UserService extends GeneratedUserService {
  private authService: AuthService;
  private permissionService: PermissionService;

  constructor() {
    super();
    this.authService = new AuthService();
    this.permissionService = new PermissionService();
  }

  // 커스텀 메서드: 사용자 등록
  async registerUser(input: CreateUserInput): Promise<User> {
    // 1. 이메일 중복 체크
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    // 2. 비밀번호 해시
    const passwordHash = await this.authService.hashPassword(input.password);

    // 3. 사용자 생성 (부모 클래스 메서드 사용)
    const user = await this.create({
      ...input,
      passwordHash,
    });

    // 4. 기본 역할 할당
    await this.permissionService.assignDefaultRole(user.id);

    return user;
  }

  // 커스텀 메서드: 사용자 검색
  async searchUsers(query: string): Promise<User[]> {
    // 복잡한 검색 로직
    return this.db.query(`
      SELECT * FROM users
      WHERE username ILIKE $1 OR email ILIKE $1
      LIMIT 20
    `, [`%${query}%`]);
  }
}
```

---

### 3. `src/config/` - 설정 파일

**규칙**:
- ✅ 환경별 설정 관리
- ✅ 데이터베이스 연결
- ✅ Apollo Server 설정

**예시**: `src/config/apollo.ts`
```typescript
import { ApolloServer } from '@apollo/server';
import { typeDefs as generatedTypeDefs } from '@/generated/graphql/typeDefs';
import { resolvers as generatedResolvers } from '@/generated/graphql/resolvers';
import { customResolvers } from '@/custom/resolvers';
import { customTypeDefs } from '@/custom/graphql/typeDefs';
import { authenticateUser } from '@/custom/middleware/authentication';
import { createDataLoaders } from '@/custom/dataloaders';

export function createApolloServer() {
  // TypeDefs 병합
  const typeDefs = [
    ...generatedTypeDefs,
    ...customTypeDefs,
  ];

  // Resolvers 병합
  const resolvers = {
    Query: {
      ...generatedResolvers.Query,
      ...customResolvers.Query,
    },
    Mutation: {
      ...generatedResolvers.Mutation,
      ...customResolvers.Mutation,
    },
    // 기타 타입별 리졸버
  };

  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
      user: await authenticateUser(req),
      loaders: createDataLoaders(),
    }),
    formatError: (error) => {
      console.error(error);
      return error;
    },
  });
}
```

---

### 4. `src/utils/` - 유틸리티

**규칙**:
- ✅ 재사용 가능한 헬퍼 함수
- ✅ 순수 함수 지향
- ✅ 비즈니스 로직과 분리

---

### 5. `src/tests/` - 테스트

**규칙**:
- ✅ 통합 테스트 (integration/)
- ✅ 단위 테스트 (unit/)
- ✅ 생성 코드도 테스트

---

## 실전 예제

### 예제 1: 사용자 인증 시스템 구현

메타데이터에서 `users` 테이블을 정의하면:

**1단계**: 코드 생성
```bash
npm run generate:all
```

**생성되는 파일**:
```
src/generated/
├── types/user.types.ts          # User, CreateUserInput 등
├── graphql/typeDefs/user.typeDefs.ts # GraphQL Type Definitions
├── graphql/resolvers/user.resolver.ts # 기본 CRUD
├── services/UserService.ts      # create, update, delete 등
└── database/migrations/001_create_users.sql
```

**2단계**: 커스텀 코드 작성
```
src/custom/
├── services/
│   └── AuthService.ts           # 인증 로직
├── resolvers/
│   └── auth.resolver.ts         # register, login 리졸버
└── middleware/
    └── authentication.ts        # JWT 검증
```

**3단계**: 통합

`src/config/apollo.ts` 또는 `src/index.ts`:
```typescript
// TypeDefs 통합
import { typeDefs as generatedTypeDefs } from '@/generated/graphql/typeDefs';
import { authTypeDefs } from '@/custom/graphql/auth.typeDefs';

const typeDefs = [
  ...generatedTypeDefs,    // 생성된 GraphQL 스키마
  authTypeDefs,            // 커스텀 auth 스키마 (register, login)
];

// Resolvers 통합
import { resolvers as generatedResolvers } from '@/generated/graphql/resolvers';
import { authResolvers } from '@/custom/resolvers/auth.resolver';
import { userResolvers } from '@/custom/resolvers/user.resolver';

const resolvers = {
  Query: {
    ...generatedResolvers.Query,      // 생성된 CRUD
    // 커스텀 쿼리는 덮어쓰기
  },
  Mutation: {
    ...generatedResolvers.Mutation,
    ...authResolvers.Mutation,         // register, login 추가
    ...userResolvers.Mutation,         // updateProfile 등 추가
  },
  User: {
    ...userResolvers.User,             // 필드 리졸버
  },
};

// Apollo Server 생성
const server = new ApolloServer({ typeDefs, resolvers });
```

---

### 예제 2: 새로운 필드 추가

**시나리오**: `users` 테이블에 `avatar_url` 필드 추가

**❌ 잘못된 방법**:
```typescript
// src/generated/types/user.types.ts를 직접 수정
export interface User {
  // ...
  avatarUrl: string;  // ❌ 재생성 시 사라짐!
}
```

**✅ 올바른 방법**:

1. 메타데이터 DB에 컬럼 추가:
```sql
INSERT INTO mappings_column (
    table_id, pg_column, pg_type,
    graphql_field, graphql_type,
    label, form_type
) VALUES (
    (SELECT id FROM mappings_table WHERE table_name = 'users'),
    'avatar_url', 'VARCHAR(255)',
    'avatarUrl', 'String',
    '프로필 이미지', 'url'
);
```

2. 코드 재생성:
```bash
npm run generate:all
```

3. 자동으로 타입, 스키마, 리졸버 업데이트됨!

---

### 예제 3: 복잡한 비즈니스 로직

**시나리오**: 사용자가 특정 리소스에 접근 권한이 있는지 체크

**커스텀 서비스 작성**: `src/custom/services/PermissionService.ts`
```typescript
import { RoleService } from '@/generated/services/RoleService';
import { PermissionService as GeneratedPermissionService } from '@/generated/services/PermissionService';

export class PermissionService extends GeneratedPermissionService {
  private roleService: RoleService;

  async checkAccess(userId: string, resource: string, action: string): Promise<boolean> {
    // 1. 사용자 역할 조회
    const userRoles = await this.roleService.getUserRoles(userId);

    // 2. 역할별 권한 조회
    for (const role of userRoles) {
      const permissions = await this.getRolePermissions(role.id);

      // 3. 권한 체크
      const hasPermission = permissions.some(p =>
        p.resource === resource && p.action === action
      );

      if (hasPermission) return true;
    }

    return false;
  }
}
```

**커스텀 리졸버에서 사용**: `src/custom/resolvers/user.resolver.ts`
```typescript
import { permissionService } from '@/custom/services';

export const userResolvers = {
  Mutation: {
    updateUser: async (_, { id, input }, context) => {
      // 권한 체크
      const canUpdate = await permissionService.checkAccess(
        context.user.id,
        'users',
        'update'
      );

      if (!canUpdate) {
        throw new Error('Access denied');
      }

      // 생성된 서비스 사용
      return userService.update(id, input);
    },
  },
};
```

---

## Best Practices

### ✅ DO

1. **생성 코드 확장 패턴 사용**
```typescript
import { UserService as GeneratedUserService } from '@/generated/services';

export class UserService extends GeneratedUserService {
  // 커스텀 메서드 추가
}
```

2. **메타데이터를 먼저 업데이트**
```
메타데이터 변경 → 코드 재생성 → 커스텀 코드 조정
```

3. **Git에서 생성 코드 제외 (선택적)**
```gitignore
# .gitignore
src/generated/
```

4. **타입 안전성 유지**
```typescript
// 생성된 타입 import
import type { User, CreateUserInput } from '@/generated/types';
```

5. **통합 export 사용**
```typescript
// src/custom/services/index.ts
export { AuthService } from './AuthService';
export { UserService } from './UserService';
export { PermissionService } from './PermissionService';
```

---

### ❌ DON'T

1. **생성 파일 직접 수정 금지**
```typescript
// ❌ src/generated/ 안의 파일을 직접 수정하지 마세요!
```

2. **메타데이터와 코드 불일치 방지**
```
코드만 수정하면 재생성 시 덮어쓰임
```

3. **순환 참조 방지**
```typescript
// ❌ 순환 참조
import { AuthService } from '@/custom/services/AuthService';
// AuthService에서 UserService import
```

4. **과도한 커스텀 로직 in 리졸버**
```typescript
// ❌ 리졸버에 비즈니스 로직
// ✅ 서비스 레이어로 분리
```

---

## 코드 생성 워크플로우

### 1. 메타데이터 정의
```sql
-- PostgreSQL 메타데이터 DB에 정의
INSERT INTO mappings_table (...) VALUES (...);
INSERT INTO mappings_column (...) VALUES (...);
```

### 2. 코드 생성
```bash
npm run generate:all
```

### 3. 생성 결과 확인
```
src/generated/
├── types/
├── graphql/
├── services/
└── database/
```

### 4. 커스텀 코드 작성
```typescript
// src/custom/services/UserService.ts
import { UserService as Base } from '@/generated/services';

export class UserService extends Base {
  // 커스텀 로직
}
```

### 5. 통합 및 테스트
```bash
npm run test
npm run dev
```

---

## FAQ

### Q1: 생성 파일을 Git에 커밋해야 하나요?

**A**: 선택사항입니다.

**커밋하는 경우**:
- ✅ CI/CD에서 빌드 속도 향상
- ✅ 코드 리뷰 시 변경사항 확인 가능
- ❌ 머지 충돌 가능성

**커밋하지 않는 경우**:
- ✅ 깔끔한 Git 히스토리
- ✅ 머지 충돌 없음
- ❌ CI/CD에서 코드 생성 필요

**권장**: 팀 정책에 따라 결정

---

### Q2: 생성 코드와 커스텀 코드가 충돌하면?

**A**: 커스텀 코드가 우선합니다.

```typescript
// 통합 시 spread 순서 중요
const resolvers = {
  Query: {
    ...generatedResolvers.Query,    // 먼저
    ...customResolvers.Query,       // 나중에 (덮어씀)
  },
};
```

---

### Q3: 메타데이터 변경 시 어떻게 동기화하나요?

**A**: 자동 또는 수동

**자동 모드**:
```bash
npm run dev:watch  # 메타데이터 변경 감지 → 자동 재생성
```

**수동 모드**:
```bash
npm run generate:all  # 필요할 때마다 실행
```

---

### Q4: 테이블 구조가 크게 바뀌면?

**A**: 단계적으로 진행

1. 메타데이터에 새 컬럼/테이블 추가
2. 코드 재생성
3. 컴파일 에러 확인
4. 커스텀 코드 조정
5. 테스트 실행
6. 마이그레이션 실행

---

## 관련 문서

- [메타데이터 기반 개발 완전 가이드](/var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/meta-data-driven/CLAUDE-CODE-FULL-GUIDE.md)
- [Phase 3: Backend 개발](/var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/meta-data-driven/PHASE-3-BACKEND.md)
- [코드 생성 템플릿](/var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/_docs/meta-data-driven/CODE-GENERATION-TEMPLATES.md)

---

## 버전

- **v1.0.0** (2024-10-19): 초기 가이드 작성

---

**문서 위치**: `/var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/backend/nodejs/METADATA-DRIVEN-STRUCTURE.md`
