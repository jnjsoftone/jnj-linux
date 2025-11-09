#!/usr/bin/env ts-node
/**
 * 메타데이터 복원 스크립트
 *
 * 사용법:
 *   npm run metadata:restore
 *   또는
 *   ts-node scripts/restore-metadata.ts [backup-file]
 *
 * 예시:
 *   ts-node scripts/restore-metadata.ts backups/metadata/metadata-2024-10-19T12-00-00.json
 *   또는 (최신 백업 자동 선택)
 *   ts-node scripts/restore-metadata.ts
 */

import { Postgres } from 'jnu-db';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'readline';

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

console.log('📦 메타데이터 복원 시작...\n');

const db = new Postgres(dbConfig);

// 사용자 확인
async function confirmRestore(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('⚠️  기존 메타데이터가 삭제됩니다. 계속하시겠습니까? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function restoreMetadata(backupFilePath?: string) {
  try {
    // 백업 파일 경로 결정
    let backupPath: string;

    if (backupFilePath) {
      backupPath = backupFilePath;
    } else {
      // 최신 백업 파일 자동 선택
      const backupDir = path.join(__dirname, '../backups/metadata');
      if (!fs.existsSync(backupDir)) {
        throw new Error('백업 디렉토리가 없습니다: ' + backupDir);
      }

      const backupFiles = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('metadata-') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (backupFiles.length === 0) {
        throw new Error('백업 파일이 없습니다.');
      }

      backupPath = path.join(backupDir, backupFiles[0]);
      console.log(`📄 최신 백업 파일 선택: ${backupFiles[0]}\n`);
    }

    // 백업 파일 확인
    if (!fs.existsSync(backupPath)) {
      throw new Error('백업 파일을 찾을 수 없습니다: ' + backupPath);
    }

    // 사용자 확인
    const confirmed = await confirmRestore();
    if (!confirmed) {
      console.log('\n❌ 복원 취소됨\n');
      return;
    }

    console.log('\n📝 복원 진행 중...\n');

    // 백업 데이터 읽기
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    // 기존 데이터 삭제 (역순)
    const tables = [
      'metadata_sync_log',
      'mappings_api_endpoint',
      'mappings_relation',
      'mappings_column',
      'mappings_table',
      'project',
    ];

    console.log('🗑️  기존 데이터 삭제 중...');
    for (const table of tables) {
      try {
        const deleteQuery = `DELETE FROM _metadata.${table}`;
        await db.executeQuery(deleteQuery);
        console.log(`   ✅ _metadata.${table} 삭제됨`);
      } catch (error) {
        console.log(`   ⚠️  _metadata.${table} 건너뜀 (테이블 없음)`);
      }
    }

    // 데이터 복원 (정순)
    const restoreTables = tables.reverse();

    console.log('\n📥 데이터 복원 중...');
    for (const table of restoreTables) {
      const data = backupData[table];
      if (!data || data.length === 0) {
        console.log(`   ⏭️  _metadata.${table} 건너뜀 (데이터 없음)`);
        continue;
      }

      console.log(`   복원 중: _metadata.${table}...`);

      for (const row of data) {
        try {
          await db.create(`_metadata.${table}`, row);
        } catch (error: any) {
          console.error(`   ❌ 레코드 삽입 실패 (${table}):`, error.message);
          // 계속 진행
        }
      }

      console.log(`   ✅ ${data.length}개 레코드 복원됨`);
    }

    console.log('\n✅ 복원 완료!\n');

    // 검증
    console.log('🔍 검증 중...');
    const projectResult = await db.findOne('_metadata.project', {});
    if (projectResult.success && projectResult.data) {
      const project = projectResult.data as any;
      console.log(`   ✅ 프로젝트: ${project.project_name}`);
    }

    const tablesResult = await db.find('_metadata.mappings_table', {});
    if (tablesResult.success && tablesResult.data) {
      console.log(`   ✅ 테이블 메타데이터: ${(tablesResult.data as any[]).length}개`);
    }

  } catch (error) {
    console.error('\n❌ 복원 실패:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// 인자 처리
const backupFile = process.argv[2];
restoreMetadata(backupFile);
