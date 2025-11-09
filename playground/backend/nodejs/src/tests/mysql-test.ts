/* ============================================
 * MySQL Connection Test
 * ============================================ */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/* ============================================
 * Setup
 * ============================================ */
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
const envPath = path.resolve(__dirname, '../../../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

/* ============================================
 * Types
 * ============================================ */
interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/* ============================================
 * Configuration
 * ============================================ */
const getMySQLConfig = (): MySQLConfig => {
  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB_NAME || 'test',
  };

  console.log('\n[CONFIG] MySQL Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${'*'.repeat(config.password.length)}`);
  console.log(`   Database: ${config.database}\n`);

  return config;
};

/* ============================================
 * Test Functions
 * ============================================ */
const testConnection = async (): Promise<void> => {
  const config = getMySQLConfig();
  let connection: mysql.Connection | null = null;

  try {
    console.log('[CONNECT] Attempting to connect to MySQL...');

    // Create connection
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });

    console.log('[SUCCESS] Successfully connected to MySQL!\n');

    // Test 1: Server version
    console.log('[TEST-1] Checking MySQL version...');
    const [versionRows] = await connection.query('SELECT VERSION() as version');
    const version = (versionRows as any)[0].version;
    console.log(`   MySQL Version: ${version}\n`);

    // Test 2: Current database
    console.log('[TEST-2] Checking current database...');
    const [dbRows] = await connection.query('SELECT DATABASE() as db');
    const currentDb = (dbRows as any)[0].db;
    console.log(`   Current Database: ${currentDb}\n`);

    // Test 3: List tables
    console.log('[TEST-3] Listing tables...');
    const [tables] = await connection.query('SHOW TABLES');
    const tableArray = tables as any[];

    if (tableArray.length > 0) {
      console.log(`   Found ${tableArray.length} table(s):`);
      tableArray.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('   No tables found in database');
    }
    console.log('');

    // Test 4: Current time
    console.log('[TEST-4] Testing query execution...');
    const [timeRows] = await connection.query('SELECT NOW() as server_time');
    const currentTime = (timeRows as any)[0].server_time;
    console.log(`   Server Time: ${currentTime}\n`);

    // Test 5: Connection info
    console.log('[TEST-5] Connection information...');
    const [connRows] = await connection.query(`
      SELECT
        CONNECTION_ID() as connection_id,
        USER() as user,
        @@hostname as hostname
    `);
    const connInfo = (connRows as any)[0];
    console.log(`   Connection ID: ${connInfo.connection_id}`);
    console.log(`   User: ${connInfo.user}`);
    console.log(`   Hostname: ${connInfo.hostname}\n`);

    console.log('[PASS] All tests passed successfully!');

  } catch (error) {
    console.error('[FAIL] MySQL connection test failed!');

    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);

      // Provide helpful error messages
      if (error.message.includes('ECONNREFUSED')) {
        console.error('\n[TIP] MySQL server might not be running or the host/port is incorrect');
      } else if (error.message.includes('Access denied')) {
        console.error('\n[TIP] Check your username and password');
      } else if (error.message.includes('Unknown database')) {
        console.error('\n[TIP] The database does not exist. Create it first.');
      }
    } else {
      console.error('   Unknown error:', error);
    }

    throw error;

  } finally {
    // Close connection
    if (connection) {
      await connection.end();
      console.log('\n[CLOSE] Connection closed');
    }
  }
};

/* ============================================
 * Main Execution
 * ============================================ */
const main = async (): Promise<void> => {
  console.log('='.repeat(60));
  console.log('MySQL Connection Test');
  console.log('='.repeat(60));

  try {
    await testConnection();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

// Run if executed directly
main();

/* ============================================
 * Export
 * ============================================ */
export {
  testConnection,
  getMySQLConfig,
};
