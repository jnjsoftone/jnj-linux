# 개발 환경 설정 가이드

이 프로젝트는 모든 하위 프로젝트에서 공유되는 단일 루트 `.env` 파일을 사용합니다.

## 파일 구조

```
{projectName}/
├── .env                          # ✅ 단일 진실 공급원
├── .env.dev                      # 개발 환경 덮어쓰기
├── .env.prod                     # 프로덕션 환경 덮어쓰기
├── backend/
│   ├── nodejs/
│   │   └── env.config.js        # 설정 로더
│   └── python/
│       └── env_config.py        # 설정 로더
└── frontend/
    ├── nextjs-app/
    │   └── env.config.ts        # 설정 로더
    └── sveltekit-app/
        └── src/lib/env.config.ts # 설정 로더
```

## 사용 예시

### 백엔드 - Node.js

```javascript
// 설정 로드
const config = require('./env.config');

// MySQL 사용
const mysql = require('mysql2/promise');
const connection = await mysql.createConnection(config.mysql);

// 서버 포트 사용
const app = express();
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
```

### 프론트엔드 - Next.js

#### 서버 사이드 (API Routes, getServerSideProps 등)

```typescript
import { env } from './env.config';

// API 라우트에서
export default async function handler(req, res) {
  // 데이터베이스에 직접 접근 (서버 사이드만)
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection(env.server.mysql);
  // ...
}
```

#### 클라이언트 사이드 (컴포넌트, hooks 등)

```typescript
import { env } from './env.config';

export default function MyComponent() {
  useEffect(() => {
    // 백엔드 API 호출 (클라이언트에서 안전)
    fetch(`${env.client.graphqlUrl}`, {
      method: 'POST',
      body: JSON.stringify({ query: '...' })
    });
  }, []);
}
```

## 중요 사항

### 보안

1. **절대 클라이언트 사이드에 민감한 데이터를 노출하지 마세요**:
   - ❌ 데이터베이스 자격 증명
   - ❌ API 시크릿
   - ❌ 개인 키

2. **클라이언트 사이드 변수는 반드시 접두사가 있어야 함**:
   - Next.js: `NEXT_PUBLIC_*`
   - SvelteKit: `PUBLIC_*`

3. **백엔드 URL은 노출해도 안전함** (자격 증명이 아닌 URL일 뿐)

## 모범 사례

1. **직접 `process.env` 접근 대신 설정 모듈 사용**
2. **`.env`를 버전 관리에 유지** (민감한 데이터 제외)
3. **로컬 덮어쓰기에 `.env.local` 사용** (gitignore됨)
4. **모든 환경 변수 문서화**
5. **앱 시작 시 필수 변수 유효성 검사**

---
**최종 업데이트**: 2024-10-19
