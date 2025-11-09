# 메타데이터 관리 스크립트

> `jnu-db` 패키지를 활용한 PostgreSQL 메타데이터 관리 스크립트

## 📋 스크립트 목록

### 1. `init-metadata.ts` - 메타데이터 초기화

프로젝트의 메타데이터 테이블을 생성하고 초기화합니다.

**실행:**
```bash
npm run metadata:init
```

**수행 작업:**
1. `_metadata` schema 생성
2. PostgreSQL 확장 설치 (btree_gin, pg_trgm)
3. ENUM 타입 생성 (relation_type, http_method, project_status, project_template)
4. 메타데이터 테이블 생성 (project, mappings_table, mappings_column, mappings_relation, etc.)
5. 인덱스 생성 (GIN, 부분 인덱스, 복합 인덱스)
6. 트리거 생성 (updated_at 자동 업데이트)
7. 프로젝트 정보 자동 초기화 (.env 기반)
8. 검증 및 확인

**환경변수 (.env):**
```env
# PostgreSQL 연결
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=myapp_db

# 프로젝트 정보
PROJECT_ID=myapp
PROJECT_NAME=My Application
PROJECT_ROOT_PATH=/workspace/my-project
```

**출력 예시:**
```
📦 메타데이터 테이블 초기화 시작...

🔗 연결 정보:
   Host: postgres.example.com
   Port: 5432
   Database: myapp_db
   User: postgres

📝 _metadata schema 생성 완료
📝 ENUM 타입 생성 완료
📝 메타데이터 테이블 생성 완료
📝 인덱스 생성 완료
📝 트리거 생성 완료
📝 프로젝트 정보 초기화 완료
   📦 프로젝트 ID: myapp
   📦 프로젝트 이름: My Application

🔍 검증 중...
   ✅ 생성된 테이블 (6개):
      - mappings_api_endpoint
      - mappings_column
      - mappings_relation
      - mappings_table
      - metadata_sync_log
      - project

   ✅ 프로젝트 정보:
      - ID: myapp
      - Name: My Application
      - Status: DEVELOPMENT

🎉 메타데이터 테이블 초기화 완료!

다음 단계:
  1. Phase 2: 비즈니스 테이블 메타데이터 정의
  2. 코드 생성기 실행
```

---

### 2. `backup-metadata.ts` - 메타데이터 백업

모든 메타데이터 테이블을 JSON 파일로 백업합니다.

**실행:**
```bash
npm run metadata:backup
```

**백업 대상:**
- `_metadata.project`
- `_metadata.mappings_table`
- `_metadata.mappings_column`
- `_metadata.mappings_relation`
- `_metadata.mappings_api_endpoint`
- `_metadata.metadata_sync_log`

**백업 위치:**
```
backend/nodejs/backups/metadata/
└── metadata-2024-10-19T12-00-00.json
```

**출력 예시:**
```
📦 메타데이터 백업 시작...

📝 백업 대상 테이블:
   - _metadata.project
   - _metadata.mappings_table
   - _metadata.mappings_column
   - _metadata.mappings_relation
   - _metadata.mappings_api_endpoint
   - _metadata.metadata_sync_log

   백업 중: _metadata.project...
   ✅ 1개 레코드 백업됨
   백업 중: _metadata.mappings_table...
   ✅ 10개 레코드 백업됨
   백업 중: _metadata.mappings_column...
   ✅ 87개 레코드 백업됨
   ...

✅ 백업 완료!
📄 백업 파일: backend/nodejs/backups/metadata/metadata-2024-10-19T12-00-00.json

📂 백업 파일 목록:
   1. metadata-2024-10-19T12-00-00.json (45.23 KB)
   2. metadata-2024-10-18T15-30-00.json (44.87 KB)
   3. metadata-2024-10-17T09-15-00.json (43.12 KB)
   ... 외 7개 파일
```

---

### 3. `restore-metadata.ts` - 메타데이터 복원

백업 파일로부터 메타데이터를 복원합니다.

**실행:**
```bash
# 최신 백업 자동 선택
npm run metadata:restore

# 또는 특정 백업 파일 지정
ts-node scripts/restore-metadata.ts backups/metadata/metadata-2024-10-19T12-00-00.json
```

**동작 과정:**
1. 백업 파일 확인
2. 사용자 확인 요청 (기존 데이터 삭제 경고)
3. 기존 메타데이터 삭제
4. 백업 데이터 복원
5. 검증

**주의사항:**
- ⚠️  **기존 메타데이터가 모두 삭제됩니다!**
- ⚠️  복원 전 반드시 백업을 수행하세요.
- ⚠️  사용자 확인이 필요합니다 (`yes` 입력).

**출력 예시:**
```
📦 메타데이터 복원 시작...

📄 최신 백업 파일 선택: metadata-2024-10-19T12-00-00.json

⚠️  기존 메타데이터가 삭제됩니다. 계속하시겠습니까? (yes/no): yes

📝 복원 진행 중...

🗑️  기존 데이터 삭제 중...
   ✅ _metadata.metadata_sync_log 삭제됨
   ✅ _metadata.mappings_api_endpoint 삭제됨
   ✅ _metadata.mappings_relation 삭제됨
   ✅ _metadata.mappings_column 삭제됨
   ✅ _metadata.mappings_table 삭제됨
   ✅ _metadata.project 삭제됨

📥 데이터 복원 중...
   복원 중: _metadata.project...
   ✅ 1개 레코드 복원됨
   복원 중: _metadata.mappings_table...
   ✅ 10개 레코드 복원됨
   ...

✅ 복원 완료!

🔍 검증 중...
   ✅ 프로젝트: My Application
   ✅ 테이블 메타데이터: 10개
```

---

## 🔧 사용 시나리오

### 시나리오 1: 새 프로젝트 시작

```bash
# 1. 프로젝트 생성 및 설정
cd /workspace/my-project/backend/nodejs
npm install

# 2. .env 파일 설정
cat > .env <<EOF
DB_HOST=postgres.example.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=myapp_db
PROJECT_ID=myapp
PROJECT_NAME=My Application
PROJECT_ROOT_PATH=/workspace/my-project
EOF

# 3. 메타데이터 초기화
npm run metadata:init

# 4. 성공!
```

### 시나리오 2: 정기 백업

```bash
# Cron job 설정 (매일 자정)
0 0 * * * cd /workspace/my-project/backend/nodejs && npm run metadata:backup

# 또는 수동 실행
npm run metadata:backup
```

### 시나리오 3: 개발 환경 → 스테이징 환경 복사

```bash
# 개발 환경에서 백업
cd /workspace/my-project-dev/backend/nodejs
npm run metadata:backup

# 백업 파일 복사
cp backups/metadata/metadata-2024-10-19T12-00-00.json \
   /workspace/my-project-staging/backend/nodejs/backups/metadata/

# 스테이징 환경에서 복원
cd /workspace/my-project-staging/backend/nodejs
ts-node scripts/restore-metadata.ts backups/metadata/metadata-2024-10-19T12-00-00.json
```

### 시나리오 4: 메타데이터 롤백

```bash
# 문제 발생 시 이전 백업으로 복원
npm run metadata:restore
# (최신 백업 자동 선택)

# 또는 특정 시점으로 복원
ts-node scripts/restore-metadata.ts backups/metadata/metadata-2024-10-18T15-30-00.json
```

---

## 🛠️ 기술 스택

- **jnu-db**: 자체 개발 PostgreSQL 유틸리티 라이브러리
- **pg**: PostgreSQL 클라이언트
- **dotenv**: 환경변수 관리
- **tsx**: TypeScript 실행 (ts-node 대체)

---

## 📚 관련 문서

- [PHASE-1-METADATA-TABLES-SETUP.md](../../../_docs/meta-data-driven/workflows/PHASE-1-METADATA-TABLES-SETUP.md) - 메타데이터 테이블 설명
- [jnu-db 문서](/var/services/homes/jungsam/apps/npmjs/jnu-db/README.md) - jnu-db 패키지 사용법

---

## ⚠️  주의사항

1. **환경변수 필수**: `.env` 파일에 DB 연결 정보가 반드시 설정되어야 합니다.
2. **원격 DB 권한**: PostgreSQL 서버에 CREATE SCHEMA, CREATE TABLE 권한 필요.
3. **백업 중요성**: 복원 작업 전 반드시 백업을 수행하세요.
4. **운영 환경**: 운영 DB에서는 더욱 신중하게 작업하세요.

---

**문서 위치**: `/var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/backend/nodejs/scripts/`

**버전**: 1.0.0
