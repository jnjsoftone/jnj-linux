import mysql from 'mysql2/promise';
import { Connection, RowDataPacket } from 'mysql2/promise';
import pkg from 'pg';
const { Client } = pkg;
type PgClient = InstanceType<typeof Client>;

interface MysqlConnectionConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  tableName: string;
}

interface MysqlDBConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

interface PostgresConnectionConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  tableName: string;
}

interface PostgresDBConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

interface MigrationResult {
  success: boolean;
  message?: string;
  error?: Error;
  rowsTransferred?: number;
}

interface SchemaResult {
  success: boolean;
  message?: string;
  error?: Error;
}

interface DataResult {
  success: boolean;
  message?: string;
  error?: Error;
  rowsTransferred?: number;
}

interface DBMigrationResult {
  success: boolean;
  message?: string;
  error?: Error;
  totalTables?: number;
  successfulTables?: number;
  failedTables?: string[];
  totalRowsTransferred?: number;
}

/**
 * Copy only the table schema (structure) from source MySQL to destination MySQL
 * @param src Source MySQL connection configuration with tableName
 * @param dst Destination MySQL connection configuration with tableName
 * @param dropIfExists If true, drops the destination table if it exists (default: true)
 * @returns SchemaResult with success status and details
 */
async function copyTableSchemaFromMysqlToMysql(
  src: MysqlConnectionConfig,
  dst: MysqlConnectionConfig,
  dropIfExists: boolean = true
): Promise<SchemaResult> {
  let srcConnection: Connection | null = null;
  let dstConnection: Connection | null = null;

  try {
    // Connect to source database
    srcConnection = await mysql.createConnection({
      host: src.host,
      port: src.port ?? 3306,
      user: src.user,
      password: src.password,
      database: src.database,
    });

    // Connect to destination database
    dstConnection = await mysql.createConnection({
      host: dst.host,
      port: dst.port ?? 3306,
      user: dst.user,
      password: dst.password,
      database: dst.database,
    });

    // Get source table structure
    const [createTableResult] = await srcConnection.query<RowDataPacket[]>(
      `SHOW CREATE TABLE \`${src.tableName}\``
    );

    if (!createTableResult || createTableResult.length === 0) {
      throw new Error(`Source table '${src.tableName}' not found`);
    }

    const createTableSQL = createTableResult[0]['Create Table'] as string;

    // Check if destination table exists
    const [tableExists] = await dstConnection.query<RowDataPacket[]>(
      `SHOW TABLES LIKE ?`,
      [dst.tableName]
    );

    if (tableExists && tableExists.length > 0) {
      if (dropIfExists) {
        // Drop existing table
        await dstConnection.query(`DROP TABLE \`${dst.tableName}\``);
      } else {
        return {
          success: false,
          message: `Destination table '${dst.tableName}' already exists`,
          error: new Error('Table already exists'),
        };
      }
    }

    // Create table in destination with the new table name
    const modifiedCreateTableSQL = createTableSQL.replace(
      new RegExp(`CREATE TABLE \`${src.tableName}\``, 'i'),
      `CREATE TABLE \`${dst.tableName}\``
    );
    await dstConnection.query(modifiedCreateTableSQL);

    return {
      success: true,
      message: `Successfully copied table schema from '${src.tableName}' to '${dst.tableName}'`,
    };
  } catch (error) {
    console.error('Schema copy failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  } finally {
    // Close connections
    if (srcConnection) {
      await srcConnection.end();
    }
    if (dstConnection) {
      await dstConnection.end();
    }
  }
}

/**
 * Bulk upsert data from source MySQL table to destination MySQL table
 * Uses INSERT ... ON DUPLICATE KEY UPDATE for upsert functionality
 * @param src Source MySQL connection configuration with tableName
 * @param dst Destination MySQL connection configuration with tableName
 * @param batchSize Number of rows to transfer per batch (default: 1000)
 * @returns DataResult with success status and details
 */
async function bulkUpsertTableDataFromMysqlToMysql(
  src: MysqlConnectionConfig,
  dst: MysqlConnectionConfig,
  batchSize: number = 1000
): Promise<DataResult> {
  let srcConnection: Connection | null = null;
  let dstConnection: Connection | null = null;

  try {
    // Connect to source database
    srcConnection = await mysql.createConnection({
      host: src.host,
      port: src.port ?? 3306,
      user: src.user,
      password: src.password,
      database: src.database,
    });

    // Connect to destination database
    dstConnection = await mysql.createConnection({
      host: dst.host,
      port: dst.port ?? 3306,
      user: dst.user,
      password: dst.password,
      database: dst.database,
    });

    // Check if destination table exists
    const [tableExists] = await dstConnection.query<RowDataPacket[]>(
      `SHOW TABLES LIKE ?`,
      [dst.tableName]
    );

    if (!tableExists || tableExists.length === 0) {
      throw new Error(`Destination table '${dst.tableName}' not found`);
    }

    // Get total row count from source
    const [countResult] = await srcConnection.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM \`${src.tableName}\``
    );
    const totalRows = countResult[0].count as number;

    if (totalRows === 0) {
      return {
        success: true,
        message: 'No data to transfer.',
        rowsTransferred: 0,
      };
    }

    // Get column names from destination table
    const [columns] = await dstConnection.query<RowDataPacket[]>(
      `SHOW COLUMNS FROM \`${dst.tableName}\``
    );
    const columnNames = columns.map((col) => col.Field as string);
    const columnList = columnNames.map((col) => `\`${col}\``).join(', ');
    const placeholders = columnNames.map(() => '?').join(', ');

    // Build UPDATE clause for ON DUPLICATE KEY UPDATE
    const updateClause = columnNames
      .map((col) => `\`${col}\` = VALUES(\`${col}\`)`)
      .join(', ');

    // Transfer data in batches
    let offset = 0;
    let totalTransferred = 0;

    while (offset < totalRows) {
      // Fetch batch from source
      const [rows] = await srcConnection.query<RowDataPacket[]>(
        `SELECT * FROM \`${src.tableName}\` LIMIT ? OFFSET ?`,
        [batchSize, offset]
      );

      if (rows.length === 0) break;

      // Upsert batch into destination
      await dstConnection.beginTransaction();
      try {
        for (const row of rows) {
          const values = columnNames.map((col) => row[col]);
          await dstConnection.query(
            `INSERT INTO \`${dst.tableName}\` (${columnList}) VALUES (${placeholders})
             ON DUPLICATE KEY UPDATE ${updateClause}`,
            values
          );
        }
        await dstConnection.commit();
        totalTransferred += rows.length;
      } catch (error) {
        await dstConnection.rollback();
        throw error;
      }

      offset += batchSize;
    }

    return {
      success: true,
      message: `Successfully upserted ${totalTransferred} rows from '${src.tableName}' to '${dst.tableName}'`,
      rowsTransferred: totalTransferred,
    };
  } catch (error) {
    console.error('Data upsert failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  } finally {
    // Close connections
    if (srcConnection) {
      await srcConnection.end();
    }
    if (dstConnection) {
      await dstConnection.end();
    }
  }
}

/**
 * Copy a complete table (schema + data) from one MySQL database to another MySQL database
 * This function calls copyTableSchemaFromMysqlToMysql and then bulkUpsertTableDataFromMysqlToMysql
 * @param src Source MySQL connection configuration with tableName
 * @param dst Destination MySQL connection configuration with tableName
 * @param batchSize Number of rows to transfer per batch (default: 1000)
 * @returns MigrationResult with success status and details
 */
async function copyTableFromMysqlToMysql(
  src: MysqlConnectionConfig,
  dst: MysqlConnectionConfig,
  batchSize: number = 1000
): Promise<MigrationResult> {
  try {
    // Step 1: Copy table schema
    console.log('Step 1: Copying table schema...');
    const schemaResult = await copyTableSchemaFromMysqlToMysql(src, dst, true);

    if (!schemaResult.success) {
      return {
        success: false,
        message: `Schema copy failed: ${schemaResult.message}`,
        error: schemaResult.error,
      };
    }

    console.log('Step 1 completed:', schemaResult.message);

    // Step 2: Bulk upsert data
    console.log('Step 2: Upserting table data...');
    const dataResult = await bulkUpsertTableDataFromMysqlToMysql(src, dst, batchSize);

    if (!dataResult.success) {
      return {
        success: false,
        message: `Data upsert failed: ${dataResult.message}`,
        error: dataResult.error,
      };
    }

    console.log('Step 2 completed:', dataResult.message);

    return {
      success: true,
      message: `Successfully copied table '${src.tableName}' to '${dst.tableName}'`,
      rowsTransferred: dataResult.rowsTransferred,
    };
  } catch (error) {
    console.error('Table copy failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  }
}

/**
 * Copy only the table schema (structure) from MySQL to PostgreSQL
 * @param src Source MySQL connection configuration with tableName
 * @param dst Destination PostgreSQL connection configuration with tableName
 * @param dropIfExists If true, drops the destination table if it exists (default: true)
 * @returns SchemaResult with success status and details
 */
async function copyTableSchemaFromMysqlToPostgres(
  src: MysqlConnectionConfig,
  dst: PostgresConnectionConfig,
  dropIfExists: boolean = true
): Promise<SchemaResult> {
  let srcConnection: Connection | null = null;
  let dstClient: PgClient | null = null;

  try {
    // Connect to source MySQL database
    srcConnection = await mysql.createConnection({
      host: src.host,
      port: src.port ?? 3306,
      user: src.user,
      password: src.password,
      database: src.database,
    });

    // Connect to destination PostgreSQL database
    dstClient = new Client({
      host: dst.host,
      port: dst.port ?? 5432,
      user: dst.user,
      password: dst.password,
      database: dst.database,
    });
    await dstClient.connect();

    // Get source table structure
    const [columns] = await srcConnection.query<RowDataPacket[]>(
      `SHOW COLUMNS FROM \`${src.tableName}\``
    );

    if (!columns || columns.length === 0) {
      throw new Error(`Source table '${src.tableName}' not found`);
    }

    // Get primary key information
    const [keyInfo] = await srcConnection.query<RowDataPacket[]>(
      `SHOW KEYS FROM \`${src.tableName}\` WHERE Key_name = 'PRIMARY'`
    );

    // Check if destination table exists
    const tableExistsResult = await dstClient.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      )`,
      [dst.tableName]
    );

    if (tableExistsResult.rows[0].exists) {
      if (dropIfExists) {
        // Drop existing table
        await dstClient.query(`DROP TABLE IF EXISTS "${dst.tableName}" CASCADE`);
      } else {
        return {
          success: false,
          message: `Destination table '${dst.tableName}' already exists`,
          error: new Error('Table already exists'),
        };
      }
    }

    // Convert MySQL types to PostgreSQL types
    const mysqlToPostgresType = (mysqlType: string): string => {
      const type = mysqlType.toLowerCase();

      // Integer types
      if (type.includes('tinyint(1)')) return 'BOOLEAN';
      if (type.includes('tinyint')) return 'SMALLINT';
      if (type.includes('smallint')) return 'SMALLINT';
      if (type.includes('mediumint')) return 'INTEGER';
      if (type.includes('bigint')) return 'BIGINT';
      if (type.includes('int')) return 'INTEGER';

      // Floating point types
      if (type.includes('float')) return 'REAL';
      if (type.includes('double')) return 'DOUBLE PRECISION';
      if (type.includes('decimal') || type.includes('numeric')) {
        const match = type.match(/\((\d+),(\d+)\)/);
        return match ? `NUMERIC(${match[1]},${match[2]})` : 'NUMERIC';
      }

      // String types
      if (type.includes('char(')) {
        const match = type.match(/\((\d+)\)/);
        return match ? `CHAR(${match[1]})` : 'CHAR';
      }
      if (type.includes('varchar')) {
        const match = type.match(/\((\d+)\)/);
        return match ? `VARCHAR(${match[1]})` : 'VARCHAR';
      }
      if (type.includes('tinytext')) return 'TEXT';
      if (type.includes('mediumtext')) return 'TEXT';
      if (type.includes('longtext')) return 'TEXT';
      if (type.includes('text')) return 'TEXT';

      // Binary types
      if (type.includes('blob')) return 'BYTEA';
      if (type.includes('binary')) return 'BYTEA';

      // Date/Time types
      if (type.includes('datetime')) return 'TIMESTAMP';
      if (type.includes('timestamp')) return 'TIMESTAMP';
      if (type.includes('date')) return 'DATE';
      if (type.includes('time')) return 'TIME';
      if (type.includes('year')) return 'SMALLINT';

      // JSON types
      if (type.includes('json')) return 'JSON';

      // Enum and Set - convert to VARCHAR
      if (type.includes('enum') || type.includes('set')) return 'VARCHAR(255)';

      return 'TEXT'; // Default fallback
    };

    // Build CREATE TABLE statement for PostgreSQL
    const columnDefs = columns.map((col) => {
      const field = col.Field as string;
      const mysqlType = col.Type as string;
      const pgType = mysqlToPostgresType(mysqlType);
      const isAutoIncrement = (col.Extra as string)?.includes('auto_increment');

      // Handle AUTO_INCREMENT -> SERIAL (SERIAL is always NOT NULL with auto-generated default)
      if (isAutoIncrement) {
        if (pgType === 'BIGINT') {
          return `"${field}" BIGSERIAL`;
        } else {
          return `"${field}" SERIAL`;
        }
      }

      // For non-auto-increment columns
      const nullable = col.Null === 'YES' ? '' : 'NOT NULL';
      let def = `"${field}" ${pgType}`;

      // Add NOT NULL constraint if needed
      if (nullable) {
        def += ` ${nullable}`;
      }

      // Handle default values
      const defaultValue = col.Default;
      // Skip if default is null, undefined, or empty string
      if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
        const defaultStr = String(defaultValue).toLowerCase();

        // Handle timestamp/datetime functions
        if (
          defaultStr === 'current_timestamp' ||
          defaultStr === 'current_timestamp()' ||
          defaultStr === 'now()' ||
          defaultStr === 'localtime' ||
          defaultStr === 'localtime()' ||
          defaultStr === 'localtimestamp' ||
          defaultStr === 'localtimestamp()'
        ) {
          def += ` DEFAULT CURRENT_TIMESTAMP`;
        }
        // Handle BOOLEAN type defaults (convert 0/1 to FALSE/TRUE)
        else if (pgType === 'BOOLEAN') {
          if (defaultValue === 0 || defaultValue === '0') {
            def += ` DEFAULT FALSE`;
          } else if (defaultValue === 1 || defaultValue === '1') {
            def += ` DEFAULT TRUE`;
          } else {
            // Handle other boolean values
            const boolVal = String(defaultValue).toLowerCase();
            if (boolVal === 'true' || boolVal === 't') {
              def += ` DEFAULT TRUE`;
            } else if (boolVal === 'false' || boolVal === 'f') {
              def += ` DEFAULT FALSE`;
            }
          }
        }
        // Handle numeric defaults (don't quote)
        else if (typeof defaultValue === 'number' || !isNaN(Number(defaultValue))) {
          def += ` DEFAULT ${defaultValue}`;
        }
        // Handle string defaults (quote them)
        else if (typeof defaultValue === 'string') {
          // Escape single quotes in the string
          const escapedValue = defaultValue.replace(/'/g, "''");
          def += ` DEFAULT '${escapedValue}'`;
        }
        else {
          def += ` DEFAULT ${defaultValue}`;
        }
      }

      return def;
    });

    // Add primary key constraint if exists
    if (keyInfo && keyInfo.length > 0) {
      const pkColumns = keyInfo.map((k) => `"${k.Column_name}"`).join(', ');
      columnDefs.push(`PRIMARY KEY (${pkColumns})`);
    }

    const createTableSQL = `CREATE TABLE "${dst.tableName}" (\n  ${columnDefs.join(',\n  ')}\n)`;

    // Debug: log the SQL statement (comment out in production)
    console.log('CREATE TABLE SQL:', createTableSQL);

    await dstClient.query(createTableSQL);

    return {
      success: true,
      message: `Successfully copied table schema from '${src.tableName}' to '${dst.tableName}'`,
    };
  } catch (error) {
    console.error('Schema copy failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  } finally {
    // Close connections
    if (srcConnection) {
      await srcConnection.end();
    }
    if (dstClient) {
      await dstClient.end();
    }
  }
}

/**
 * Bulk upsert data from source MySQL table to destination PostgreSQL table
 * Uses INSERT ... ON CONFLICT ... DO UPDATE for upsert functionality
 * @param src Source MySQL connection configuration with tableName
 * @param dst Destination PostgreSQL connection configuration with tableName
 * @param batchSize Number of rows to transfer per batch (default: 1000)
 * @returns DataResult with success status and details
 */
async function bulkUpsertTableDataFromMysqlToPostgres(
  src: MysqlConnectionConfig,
  dst: PostgresConnectionConfig,
  batchSize: number = 1000
): Promise<DataResult> {
  let srcConnection: Connection | null = null;
  let dstClient: PgClient | null = null;

  try {
    // Connect to source MySQL database
    srcConnection = await mysql.createConnection({
      host: src.host,
      port: src.port ?? 3306,
      user: src.user,
      password: src.password,
      database: src.database,
    });

    // Connect to destination PostgreSQL database
    dstClient = new Client({
      host: dst.host,
      port: dst.port ?? 5432,
      user: dst.user,
      password: dst.password,
      database: dst.database,
    });
    await dstClient.connect();

    // Check if destination table exists
    const tableExistsResult = await dstClient.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      )`,
      [dst.tableName]
    );

    if (!tableExistsResult.rows[0].exists) {
      throw new Error(`Destination table '${dst.tableName}' not found`);
    }

    // Get total row count from source
    const [countResult] = await srcConnection.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM \`${src.tableName}\``
    );
    const totalRows = countResult[0].count as number;

    if (totalRows === 0) {
      return {
        success: true,
        message: 'No data to transfer.',
        rowsTransferred: 0,
      };
    }

    // Get column names from destination PostgreSQL table
    const columnsResult = await dstClient.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'
       AND table_name = $1
       ORDER BY ordinal_position`,
      [dst.tableName]
    );
    const columnNames = columnsResult.rows.map((row) => row.column_name);
    const columnList = columnNames.map((col) => `"${col}"`).join(', ');

    // Get primary key columns for ON CONFLICT clause
    const pkResult = await dstClient.query(
      `SELECT a.attname
       FROM pg_index i
       JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
       WHERE i.indrelid = $1::regclass
       AND i.indisprimary`,
      [dst.tableName]
    );

    let upsertSQL: string;
    if (pkResult.rows.length > 0) {
      // Has primary key - use upsert
      const pkColumns = pkResult.rows.map((row) => `"${row.attname}"`).join(', ');
      const updateClause = columnNames
        .filter((col) => !pkResult.rows.some((pk) => pk.attname === col))
        .map((col) => `"${col}" = EXCLUDED."${col}"`)
        .join(', ');

      const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ');
      upsertSQL = `INSERT INTO "${dst.tableName}" (${columnList}) VALUES (${placeholders})
                   ON CONFLICT (${pkColumns}) DO UPDATE SET ${updateClause}`;
    } else {
      // No primary key - use simple insert
      const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ');
      upsertSQL = `INSERT INTO "${dst.tableName}" (${columnList}) VALUES (${placeholders})`;
    }

    // Transfer data in batches
    let offset = 0;
    let totalTransferred = 0;

    while (offset < totalRows) {
      // Fetch batch from source
      const [rows] = await srcConnection.query<RowDataPacket[]>(
        `SELECT * FROM \`${src.tableName}\` LIMIT ? OFFSET ?`,
        [batchSize, offset]
      );

      if (rows.length === 0) break;

      // Upsert batch into destination
      await dstClient.query('BEGIN');
      try {
        for (const row of rows) {
          const values = columnNames.map((col) => {
            const value = row[col];
            // Handle MySQL TINYINT(1) -> PostgreSQL BOOLEAN conversion
            if (typeof value === 'number' && (value === 0 || value === 1)) {
              // Check if the column type in destination is boolean
              return value;
            }
            return value;
          });
          await dstClient.query(upsertSQL, values);
        }
        await dstClient.query('COMMIT');
        totalTransferred += rows.length;
      } catch (error) {
        await dstClient.query('ROLLBACK');
        throw error;
      }

      offset += batchSize;
    }

    return {
      success: true,
      message: `Successfully upserted ${totalTransferred} rows from '${src.tableName}' to '${dst.tableName}'`,
      rowsTransferred: totalTransferred,
    };
  } catch (error) {
    console.error('Data upsert failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  } finally {
    // Close connections
    if (srcConnection) {
      await srcConnection.end();
    }
    if (dstClient) {
      await dstClient.end();
    }
  }
}

/**
 * Copy an entire database (all tables with schema + data) from one MySQL database to another MySQL database
 * This function gets all tables from the source database and calls copyTableFromMysqlToMysql for each table
 * @param src Source MySQL database configuration (without tableName)
 * @param dst Destination MySQL database configuration (without tableName)
 * @param batchSize Number of rows to transfer per batch for each table (default: 1000)
 * @returns DBMigrationResult with success status and details
 */
async function copyDBFromMysqlToMysql(
  src: MysqlDBConfig,
  dst: MysqlDBConfig,
  batchSize: number = 1000
): Promise<DBMigrationResult> {
  let srcConnection: Connection | null = null;

  try {
    // Connect to source database to get table list
    srcConnection = await mysql.createConnection({
      host: src.host,
      port: src.port ?? 3306,
      user: src.user,
      password: src.password,
      database: src.database,
    });

    // Get all tables from source database
    const [tables] = await srcConnection.query<RowDataPacket[]>('SHOW TABLES');

    if (!tables || tables.length === 0) {
      return {
        success: true,
        message: `No tables found in source database '${src.database}'`,
        totalTables: 0,
        successfulTables: 0,
        failedTables: [],
        totalRowsTransferred: 0,
      };
    }

    // Extract table names from result
    const tableNameKey = Object.keys(tables[0])[0];
    const tableNames = tables.map((row) => row[tableNameKey] as string);

    console.log(`Found ${tableNames.length} tables in source database '${src.database}'`);
    console.log(`Tables: ${tableNames.join(', ')}`);

    let successfulTables = 0;
    const failedTables: string[] = [];
    let totalRowsTransferred = 0;

    // Copy each table
    for (let i = 0; i < tableNames.length; i++) {
      const tableName = tableNames[i];
      console.log(`\n[${i + 1}/${tableNames.length}] Copying table: ${tableName}`);

      const srcTableConfig: MysqlConnectionConfig = {
        ...src,
        tableName,
      };

      const dstTableConfig: MysqlConnectionConfig = {
        ...dst,
        tableName,
      };

      try {
        const result = await copyTableFromMysqlToMysql(srcTableConfig, dstTableConfig, batchSize);

        if (result.success) {
          successfulTables++;
          totalRowsTransferred += result.rowsTransferred ?? 0;
          console.log(`✓ Successfully copied table '${tableName}' (${result.rowsTransferred ?? 0} rows)`);
        } else {
          failedTables.push(tableName);
          console.error(`✗ Failed to copy table '${tableName}': ${result.message}`);
        }
      } catch (error) {
        failedTables.push(tableName);
        console.error(`✗ Failed to copy table '${tableName}':`, error);
      }
    }

    const allSuccess = failedTables.length === 0;

    return {
      success: allSuccess,
      message: allSuccess
        ? `Successfully copied all ${tableNames.length} tables from '${src.database}' to '${dst.database}'`
        : `Copied ${successfulTables}/${tableNames.length} tables. Failed: ${failedTables.join(', ')}`,
      totalTables: tableNames.length,
      successfulTables,
      failedTables,
      totalRowsTransferred,
    };
  } catch (error) {
    console.error('Database copy failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  } finally {
    // Close connection
    if (srcConnection) {
      await srcConnection.end();
    }
  }
}

/**
 * Copy a complete table (schema + data) from MySQL to PostgreSQL
 * This function calls copyTableSchemaFromMysqlToPostgres and then bulkUpsertTableDataFromMysqlToPostgres
 * @param src Source MySQL connection configuration with tableName
 * @param dst Destination PostgreSQL connection configuration with tableName
 * @param batchSize Number of rows to transfer per batch (default: 1000)
 * @returns MigrationResult with success status and details
 */
async function copyTableFromMysqlToPostgres(
  src: MysqlConnectionConfig,
  dst: PostgresConnectionConfig,
  batchSize: number = 1000
): Promise<MigrationResult> {
  try {
    // Step 1: Copy table schema
    console.log('Step 1: Copying table schema from MySQL to PostgreSQL...');
    const schemaResult = await copyTableSchemaFromMysqlToPostgres(src, dst, true);

    if (!schemaResult.success) {
      return {
        success: false,
        message: `Schema copy failed: ${schemaResult.message}`,
        error: schemaResult.error,
      };
    }

    console.log('Step 1 completed:', schemaResult.message);

    // Step 2: Bulk upsert data
    console.log('Step 2: Upserting table data from MySQL to PostgreSQL...');
    const dataResult = await bulkUpsertTableDataFromMysqlToPostgres(src, dst, batchSize);

    if (!dataResult.success) {
      return {
        success: false,
        message: `Data upsert failed: ${dataResult.message}`,
        error: dataResult.error,
      };
    }

    console.log('Step 2 completed:', dataResult.message);

    return {
      success: true,
      message: `Successfully copied table '${src.tableName}' to '${dst.tableName}'`,
      rowsTransferred: dataResult.rowsTransferred,
    };
  } catch (error) {
    console.error('Table copy failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  }
}

/**
 * Copy an entire database from MySQL to PostgreSQL (all tables with schema + data)
 * This function gets all tables from the source MySQL database and calls copyTableFromMysqlToPostgres for each table
 * @param src Source MySQL database configuration (without tableName)
 * @param dst Destination PostgreSQL database configuration (without tableName)
 * @param batchSize Number of rows to transfer per batch for each table (default: 1000)
 * @returns DBMigrationResult with success status and details
 */
async function copyDBFromMysqlToPostgres(
  src: MysqlDBConfig,
  dst: PostgresDBConfig,
  batchSize: number = 1000
): Promise<DBMigrationResult> {
  let srcConnection: Connection | null = null;

  try {
    // Connect to source database to get table list
    srcConnection = await mysql.createConnection({
      host: src.host,
      port: src.port ?? 3306,
      user: src.user,
      password: src.password,
      database: src.database,
    });

    // Get all tables from source database
    const [tables] = await srcConnection.query<RowDataPacket[]>('SHOW TABLES');

    if (!tables || tables.length === 0) {
      return {
        success: true,
        message: `No tables found in source database '${src.database}'`,
        totalTables: 0,
        successfulTables: 0,
        failedTables: [],
        totalRowsTransferred: 0,
      };
    }

    // Extract table names from result
    const tableNameKey = Object.keys(tables[0])[0];
    const tableNames = tables.map((row) => row[tableNameKey] as string);

    console.log(`Found ${tableNames.length} tables in source MySQL database '${src.database}'`);
    console.log(`Tables: ${tableNames.join(', ')}`);

    let successfulTables = 0;
    const failedTables: string[] = [];
    let totalRowsTransferred = 0;

    // Copy each table
    for (let i = 0; i < tableNames.length; i++) {
      const tableName = tableNames[i];
      console.log(`\n[${i + 1}/${tableNames.length}] Copying table from MySQL to PostgreSQL: ${tableName}`);

      const srcTableConfig: MysqlConnectionConfig = {
        ...src,
        tableName,
      };

      const dstTableConfig: PostgresConnectionConfig = {
        ...dst,
        tableName,
      };

      try {
        const result = await copyTableFromMysqlToPostgres(srcTableConfig, dstTableConfig, batchSize);

        if (result.success) {
          successfulTables++;
          totalRowsTransferred += result.rowsTransferred ?? 0;
          console.log(`✓ Successfully copied table '${tableName}' (${result.rowsTransferred ?? 0} rows)`);
        } else {
          failedTables.push(tableName);
          console.error(`✗ Failed to copy table '${tableName}': ${result.message}`);
        }
      } catch (error) {
        failedTables.push(tableName);
        console.error(`✗ Failed to copy table '${tableName}':`, error);
      }
    }

    const allSuccess = failedTables.length === 0;

    return {
      success: allSuccess,
      message: allSuccess
        ? `Successfully copied all ${tableNames.length} tables from MySQL '${src.database}' to PostgreSQL '${dst.database}'`
        : `Copied ${successfulTables}/${tableNames.length} tables. Failed: ${failedTables.join(', ')}`,
      totalTables: tableNames.length,
      successfulTables,
      failedTables,
      totalRowsTransferred,
    };
  } catch (error) {
    console.error('Database copy failed:', error);
    return {
      success: false,
      error: error as Error,
      message: (error as Error).message,
    };
  } finally {
    // Close connection
    if (srcConnection) {
      await srcConnection.end();
    }
  }
}

export {
  copyTableSchemaFromMysqlToMysql,
  bulkUpsertTableDataFromMysqlToMysql,
  copyTableFromMysqlToMysql,
  copyDBFromMysqlToMysql,
  copyTableSchemaFromMysqlToPostgres,
  bulkUpsertTableDataFromMysqlToPostgres,
  copyTableFromMysqlToPostgres,
  copyDBFromMysqlToPostgres,
};
