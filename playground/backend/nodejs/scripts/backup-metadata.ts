#!/usr/bin/env ts-node
/**
 * 메타데이터 백업 스크립트
 *
 * 사용법:
 *   npm run metadata:backup
 *   또는
 *   ts-node scripts/backup-metadata.ts
 */

import { Postgres } from 'jnu-db';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
};

console.log('📦 메타데이터 백업 시작...\n');

const db = new Postgres(dbConfig);

async function backupMetadata() {
  try {
    // 백업 디렉토리
    const backupDir = path.join(__dirname, '../backups/metadata');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 백업 파일명 (타임스탬프 포함)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = path.join(backupDir, `metadata-${timestamp}.json`);

    console.log('📝 백업 대상 테이블:');
    console.log('   - _metadata.project');
    console.log('   - _metadata.mappings_table');
    console.log('   - _metadata.mappings_column');
    console.log('   - _metadata.mappings_relation');
    console.log('   - _metadata.mappings_api_endpoint');
    console.log('   - _metadata.metadata_sync_log\n');

    // 메타데이터 테이블 백업
    const backup: Record<string, any[]> = {};

    const tables = [
      'project',
      'mappings_table',
      'mappings_column',
      'mappings_relation',
      'mappings_api_endpoint',
      'metadata_sync_log',
    ];

    for (const table of tables) {
      console.log(`   백업 중: _metadata.${table}...`);
      const result = await db.find(`_metadata.${table}`, {});

      if (result.success && result.data) {
        backup[table] = result.data as any[];
        console.log(`   ✅ ${(result.data as any[]).length}개 레코드 백업됨`);
      } else {
        console.log(`   ⚠️  건너뜀 (테이블 없음 또는 빈 테이블)`);
        backup[table] = [];
      }
    }

    // JSON 파일로 저장
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log(`\n✅ 백업 완료!`);
    console.log(`📄 백업 파일: ${backupPath}\n`);

    // 백업 파일 목록
    const backupFiles = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('metadata-') && f.endsWith('.json'))
      .sort()
      .reverse();

    console.log('📂 백업 파일 목록:');
    backupFiles.slice(0, 5).forEach((file, idx) => {
      const stats = fs.statSync(path.join(backupDir, file));
      const size = (stats.size / 1024).toFixed(2);
      console.log(`   ${idx + 1}. ${file} (${size} KB)`);
    });

    if (backupFiles.length > 5) {
      console.log(`   ... 외 ${backupFiles.length - 5}개 파일`);
    }

  } catch (error) {
    console.error('\n❌ 백업 실패:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

backupMetadata();
