#!/usr/bin/env ts-node
/**
 * 메타데이터 테이블 초기화 스크립트
 *
 * 사용법:
 *   npm run init-metadata
 *   또는
 *   ts-node scripts/init-metadata.ts
 *
 * 환경변수 (.env):
 *   DB_HOST=localhost
 *   DB_PORT=5432
 *   DB_USER=postgres
 *   DB_PASSWORD=your_password
 *   DB_NAME=your_project_db
 */

import { Postgres } from 'jnu-db';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.join(__dirname, '../.env') });

// PostgreSQL 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
};

console.log('📦 메타데이터 테이블 초기화 시작...\n');
console.log('🔗 연결 정보:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}\n`);

const db = new Postgres(dbConfig);

/**
 * ENUM 타입 생성
 */
async function createEnumTypes() {
  console.log('📝 ENUM 타입 생성 중...');

  const enumQueries = [
    // relation_type_enum
    `
    DO $$ BEGIN
      CREATE TYPE _metadata.relation_type_enum AS ENUM (
        'OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    `,

    // http_method_enum
    `
    DO $$ BEGIN
      CREATE TYPE _metadata.http_method_enum AS ENUM (
        'GET', 'POST', 'PUT', 'DELETE', 'PATCH'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    `,

    // project_status_enum
    `
    DO $$ BEGIN
      CREATE TYPE _metadata.project_status_enum AS ENUM (
        'PLANNING', 'DEVELOPMENT', 'TESTING', 'STAGING', 'PRODUCTION', 'MAINTENANCE', 'ARCHIVED'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    `,

    // project_template_enum
    `
    DO $$ BEGIN
      CREATE TYPE _metadata.project_template_enum AS ENUM (
        'BASIC', 'ECOMMERCE', 'CMS', 'DASHBOARD', 'API_ONLY', 'MOBILE_BACKEND', 'MICROSERVICE'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    `,
  ];

  for (const query of enumQueries) {
    const result = await db.executeQuery(query);
    if (!result.success) {
      console.error('   ❌ ENUM 타입 생성 실패:', result.error);
      throw result.error;
    }
  }

  console.log('   ✅ ENUM 타입 생성 완료\n');
}

/**
 * 메타데이터 테이블 생성
 */
async function createMetadataTables() {
  console.log('📝 메타데이터 테이블 생성 중...');

  // SQL 파일 읽기
  const sqlFilePath = path.join(__dirname, 'metadata-tables.sql');

  let sqlContent: string;
  if (fs.existsSync(sqlFilePath)) {
    sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    console.log(`   📄 SQL 파일 로드: ${sqlFilePath}`);
  } else {
    // SQL 파일이 없으면 인라인 SQL 사용
    console.log('   ⚠️  SQL 파일 없음, 인라인 SQL 사용');
    sqlContent = getInlineMetadataSQL();
  }

  const result = await db.executeQuery(sqlContent);
  if (!result.success) {
    console.error('   ❌ 테이블 생성 실패:', result.error);
    throw result.error;
  }

  console.log('   ✅ 메타데이터 테이블 생성 완료\n');
}

/**
 * 인덱스 생성
 */
async function createIndexes() {
  console.log('📝 인덱스 생성 중...');

  const indexQueries = [
    // JSONB GIN 인덱스
    `CREATE INDEX IF NOT EXISTS idx_mappings_column_enum_options
     ON _metadata.mappings_column USING GIN (enum_options)`,

    `CREATE INDEX IF NOT EXISTS idx_mappings_column_validation_rules
     ON _metadata.mappings_column USING GIN (validation_rules)`,

    `CREATE INDEX IF NOT EXISTS idx_project_tech_stack
     ON _metadata.project USING GIN (tech_stack)`,

    // 부분 인덱스
    `CREATE INDEX IF NOT EXISTS idx_mappings_column_api_fields
     ON _metadata.mappings_column (table_name, pg_column) WHERE is_api_field = TRUE`,

    `CREATE INDEX IF NOT EXISTS idx_mappings_column_searchable
     ON _metadata.mappings_column (table_name) WHERE is_searchable = TRUE`,

    // 복합 인덱스
    `CREATE INDEX IF NOT EXISTS idx_mappings_column_table_order
     ON _metadata.mappings_column (schema_name, table_name, sort_order)`,

    `CREATE INDEX IF NOT EXISTS idx_project_status
     ON _metadata.project(status)`,

    `CREATE INDEX IF NOT EXISTS idx_metadata_sync_log_table
     ON _metadata.metadata_sync_log(table_name, changed_at DESC)`,
  ];

  for (const query of indexQueries) {
    const result = await db.executeQuery(query);
    if (!result.success) {
      console.error('   ❌ 인덱스 생성 실패:', result.error);
      throw result.error;
    }
  }

  console.log('   ✅ 인덱스 생성 완료\n');
}

/**
 * 트리거 생성
 */
async function createTriggers() {
  console.log('📝 트리거 생성 중...');

  // updated_at 자동 업데이트 함수
  const functionSQL = `
    CREATE OR REPLACE FUNCTION _metadata.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  let result = await db.executeQuery(functionSQL);
  if (!result.success) {
    console.error('   ❌ 함수 생성 실패:', result.error);
    throw result.error;
  }

  // 트리거 생성
  const triggerQueries = [
    `DROP TRIGGER IF EXISTS trigger_mappings_table_updated_at ON _metadata.mappings_table`,
    `CREATE TRIGGER trigger_mappings_table_updated_at
     BEFORE UPDATE ON _metadata.mappings_table
     FOR EACH ROW EXECUTE FUNCTION _metadata.update_updated_at_column()`,

    `DROP TRIGGER IF EXISTS trigger_mappings_column_updated_at ON _metadata.mappings_column`,
    `CREATE TRIGGER trigger_mappings_column_updated_at
     BEFORE UPDATE ON _metadata.mappings_column
     FOR EACH ROW EXECUTE FUNCTION _metadata.update_updated_at_column()`,

    `DROP TRIGGER IF EXISTS trigger_project_updated_at ON _metadata.project`,
    `CREATE TRIGGER trigger_project_updated_at
     BEFORE UPDATE ON _metadata.project
     FOR EACH ROW EXECUTE FUNCTION _metadata.update_updated_at_column()`,
  ];

  for (const query of triggerQueries) {
    result = await db.executeQuery(query);
    if (!result.success) {
      console.error('   ❌ 트리거 생성 실패:', result.error);
      throw result.error;
    }
  }

  console.log('   ✅ 트리거 생성 완료\n');
}

/**
 * 프로젝트 정보 초기화
 */
async function initializeProjectInfo() {
  console.log('📝 프로젝트 정보 초기화 중...');

  const projectId = process.env.PROJECT_ID || 'my-project';
  const projectName = process.env.PROJECT_NAME || 'My Project';
  const rootPath = process.env.PROJECT_ROOT_PATH || '/workspace/my-project';

  // 기존 프로젝트 정보 확인
  const checkResult = await db.findOne('_metadata.project', {});

  if (checkResult.success && checkResult.data) {
    console.log('   ⚠️  프로젝트 정보가 이미 존재합니다. 건너뜁니다.');
    console.log(`   📦 기존 프로젝트: ${(checkResult.data as any).project_name}\n`);
    return;
  }

  // 프로젝트 정보 삽입
  const projectData = {
    id: 1,
    project_id: projectId,
    project_name: projectName,
    description: `${projectName} - Metadata-driven fullstack application`,
    root_path: rootPath,
    template: 'BASIC',
    status: 'DEVELOPMENT',
    tech_stack: {
      backend: 'Node.js 20 + TypeScript 5.3 + GraphQL',
      frontend: 'Next.js 15.5.4 + React 19',
      database: 'PostgreSQL 16'
    },
    database_config: {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      ssl: false
    },
    generation_config: {
      outputDir: './src/generated',
      includeComments: true,
      prettier: true
    }
  };

  const result = await db.create('_metadata.project', projectData);

  if (!result.success) {
    console.error('   ❌ 프로젝트 정보 초기화 실패:', result.error);
    throw result.error;
  }

  console.log('   ✅ 프로젝트 정보 초기화 완료');
  console.log(`   📦 프로젝트 ID: ${projectId}`);
  console.log(`   📦 프로젝트 이름: ${projectName}\n`);
}

/**
 * 검증
 */
async function verify() {
  console.log('🔍 검증 중...');

  // 테이블 목록 확인
  const tablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = '_metadata'
    ORDER BY table_name
  `;

  const result = await db.executeQuery<{ table_name: string }[]>(tablesQuery);

  if (!result.success) {
    console.error('   ❌ 검증 실패:', result.error);
    throw result.error;
  }

  const tables = result.data || [];
  console.log(`   ✅ 생성된 테이블 (${tables.length}개):`);
  tables.forEach((table) => {
    console.log(`      - ${table.table_name}`);
  });

  // 프로젝트 정보 확인
  const projectResult = await db.findOne('_metadata.project', {});
  if (projectResult.success && projectResult.data) {
    const project = projectResult.data as any;
    console.log(`\n   ✅ 프로젝트 정보:`);
    console.log(`      - ID: ${project.project_id}`);
    console.log(`      - Name: ${project.project_name}`);
    console.log(`      - Status: ${project.status}`);
  }

  console.log('\n');
}

/**
 * 인라인 메타데이터 테이블 SQL
 */
function getInlineMetadataSQL(): string {
  return `
    -- 1. project 테이블
    CREATE TABLE IF NOT EXISTS _metadata.project (
      id BIGSERIAL PRIMARY KEY,
      project_id VARCHAR(100) NOT NULL,
      project_name VARCHAR(200) NOT NULL,
      description TEXT,
      root_path VARCHAR(500) NOT NULL,
      backend_path VARCHAR(200) DEFAULT './backend',
      frontend_path VARCHAR(200) DEFAULT './frontend',
      database_path VARCHAR(200) DEFAULT './database',
      template _metadata.project_template_enum DEFAULT 'BASIC',
      status _metadata.project_status_enum DEFAULT 'PLANNING',
      version VARCHAR(50) DEFAULT '1.0.0',
      tech_stack JSONB,
      package_manager VARCHAR(20) DEFAULT 'npm',
      node_version VARCHAR(20),
      database_config JSONB,
      default_schema VARCHAR(100) DEFAULT 'public',
      generation_config JSONB,
      auto_generation BOOLEAN DEFAULT TRUE,
      watch_mode BOOLEAN DEFAULT TRUE,
      git_repository VARCHAR(500),
      git_branch VARCHAR(100) DEFAULT 'main',
      owner_id BIGINT,
      team_members JSONB,
      deployment_config JSONB,
      environments JSONB,
      api_config JSONB,
      external_services JSONB,
      dev_tools_config JSONB,
      linting_config JSONB,
      testing_config JSONB,
      plugins JSONB,
      custom_generators JSONB,
      readme_template TEXT,
      documentation_config JSONB,
      tags JSONB,
      metadata JSONB,
      created_by BIGINT,
      updated_by BIGINT,
      last_generation_at TIMESTAMPTZ,
      last_sync_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT single_project CHECK (id = 1)
    );

    -- 2. mappings_table
    CREATE TABLE IF NOT EXISTS _metadata.mappings_table (
      id BIGSERIAL PRIMARY KEY,
      schema_name VARCHAR(100) NOT NULL DEFAULT 'public',
      table_name VARCHAR(100) NOT NULL,
      graphql_type VARCHAR(100),
      label VARCHAR(200) NOT NULL,
      description TEXT,
      primary_key VARCHAR(100) DEFAULT 'id',
      is_api_enabled BOOLEAN DEFAULT TRUE,
      api_permissions JSONB,
      table_constraints JSONB,
      indexes JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(schema_name, table_name)
    );

    -- 3. mappings_column
    CREATE TABLE IF NOT EXISTS _metadata.mappings_column (
      id BIGSERIAL PRIMARY KEY,
      table_id BIGINT REFERENCES _metadata.mappings_table(id) ON DELETE CASCADE,
      schema_name VARCHAR(100) NOT NULL,
      table_name VARCHAR(100) NOT NULL,
      pg_column VARCHAR(100) NOT NULL,
      pg_type VARCHAR(100),
      pg_constraints JSONB,
      graphql_field VARCHAR(100),
      graphql_type VARCHAR(50),
      graphql_resolver TEXT,
      is_graphql_input BOOLEAN DEFAULT TRUE,
      is_graphql_output BOOLEAN DEFAULT TRUE,
      label VARCHAR(200) NOT NULL,
      form_type VARCHAR(50) DEFAULT 'text',
      is_required BOOLEAN DEFAULT FALSE,
      is_visible BOOLEAN DEFAULT TRUE,
      sort_order INTEGER DEFAULT 0,
      default_value TEXT,
      enum_options JSONB,
      validation_rules JSONB,
      placeholder VARCHAR(200),
      help_text TEXT,
      api_source_key VARCHAR(200),
      api_source_path VARCHAR(500),
      api_source_type VARCHAR(100),
      data_transformation JSONB,
      is_api_field BOOLEAN DEFAULT FALSE,
      api_default_value TEXT,
      api_endpoints JSONB,
      permission_read VARCHAR(100) DEFAULT 'public',
      permission_write VARCHAR(100) DEFAULT 'authenticated',
      is_searchable BOOLEAN DEFAULT FALSE,
      is_sortable BOOLEAN DEFAULT TRUE,
      is_filterable BOOLEAN DEFAULT TRUE,
      search_config JSONB,
      is_primary_key BOOLEAN DEFAULT FALSE,
      is_unique BOOLEAN DEFAULT FALSE,
      is_indexed BOOLEAN DEFAULT FALSE,
      index_config JSONB,
      comment TEXT,
      remark TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(schema_name, table_name, pg_column)
    );

    -- 4. mappings_relation
    CREATE TABLE IF NOT EXISTS _metadata.mappings_relation (
      id BIGSERIAL PRIMARY KEY,
      from_table_id BIGINT REFERENCES _metadata.mappings_table(id) ON DELETE CASCADE,
      to_table_id BIGINT REFERENCES _metadata.mappings_table(id) ON DELETE CASCADE,
      from_schema VARCHAR(100) NOT NULL,
      from_table VARCHAR(100) NOT NULL,
      from_column VARCHAR(100) NOT NULL,
      to_schema VARCHAR(100) NOT NULL,
      to_table VARCHAR(100) NOT NULL,
      to_column VARCHAR(100) NOT NULL,
      relation_type _metadata.relation_type_enum NOT NULL,
      graphql_field VARCHAR(100),
      is_cascade_delete BOOLEAN DEFAULT FALSE,
      constraint_name VARCHAR(200),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(from_schema, from_table, from_column, to_schema, to_table, to_column)
    );

    -- 5. mappings_api_endpoint (선택적)
    CREATE TABLE IF NOT EXISTS _metadata.mappings_api_endpoint (
      id BIGSERIAL PRIMARY KEY,
      endpoint_name VARCHAR(100) NOT NULL UNIQUE,
      base_url VARCHAR(500) NOT NULL,
      method _metadata.http_method_enum DEFAULT 'GET',
      headers JSONB,
      auth_config JSONB,
      rate_limit_config JSONB,
      timeout_ms INTEGER DEFAULT 30000,
      retry_config JSONB,
      cache_config JSONB,
      request_mapping JSONB,
      response_mapping JSONB,
      description TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 6. metadata_sync_log (선택적)
    CREATE TABLE IF NOT EXISTS _metadata.metadata_sync_log (
      id BIGSERIAL PRIMARY KEY,
      table_name VARCHAR(100) NOT NULL,
      operation VARCHAR(20) NOT NULL,
      record_id BIGINT,
      old_data JSONB,
      new_data JSONB,
      code_generated BOOLEAN DEFAULT FALSE,
      generation_time_ms INTEGER,
      changed_by BIGINT,
      changed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 1. _metadata schema 생성
    console.log('📝 _metadata schema 생성 중...');
    const schemaResult = await db.executeQuery('CREATE SCHEMA IF NOT EXISTS _metadata');
    if (!schemaResult.success) {
      console.error('   ❌ Schema 생성 실패:', schemaResult.error);
      throw schemaResult.error;
    }
    console.log('   ✅ _metadata schema 생성 완료\n');

    // 2. 확장 설치
    console.log('📝 PostgreSQL 확장 설치 중...');
    await db.executeQuery('CREATE EXTENSION IF NOT EXISTS btree_gin');
    await db.executeQuery('CREATE EXTENSION IF NOT EXISTS pg_trgm');
    console.log('   ✅ 확장 설치 완료\n');

    // 3. ENUM 타입 생성
    await createEnumTypes();

    // 4. 메타데이터 테이블 생성
    await createMetadataTables();

    // 5. 인덱스 생성
    await createIndexes();

    // 6. 트리거 생성
    await createTriggers();

    // 7. 프로젝트 정보 초기화
    await initializeProjectInfo();

    // 8. 검증
    await verify();

    console.log('🎉 메타데이터 테이블 초기화 완료!\n');
    console.log('다음 단계:');
    console.log('  1. Phase 2: 비즈니스 테이블 메타데이터 정의');
    console.log('  2. 코드 생성기 실행\n');

  } catch (error) {
    console.error('\n❌ 초기화 실패:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// 실행
main();
