import mysql from 'mysql2/promise';
import { Connection, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

interface MySqlConfig {
  host: string;
  user: string;
  password: string;
  database?: string;
  port?: number;
  connectionLimit?: number;
}

interface QueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
}

interface TransactionQuery {
  query: string;
  params?: any[];
}

interface TransactionResult {
  success: boolean;
  data?: any[];
  error?: Error;
}

interface FindOptions {
  where?: Record<string, any>;
  fields?: string[];
  orderBy?: string;
  limit?: number;
  offset?: number;
}

interface UpdateOptions {
  where: Record<string, any>;
  data: Record<string, any>;
}

interface UpsertOptions {
  data: Record<string, any>;
  updateData?: Record<string, any>;
}

type ConnectionLike = Connection | Pool;

const buildWhereClause = (where?: Record<string, any>) => {
  if (!where || Object.keys(where).length === 0) {
    return { clause: '', params: [] as any[] };
  }

  const keys = Object.keys(where);
  const conditions = keys.map(key => `\`${key}\` = ?`).join(' AND ');
  const params = keys.map(key => where[key]);

  return {
    clause: `WHERE ${conditions}`,
    params,
  };
};

const buildSetClause = (data: Record<string, any>) => {
  const keys = Object.keys(data);
  const assignments = keys.map(key => `\`${key}\` = ?`).join(', ');
  const params = keys.map(key => data[key]);

  return {
    clause: assignments,
    params,
  };
};

const executeQueryInternal = async <T = any>(
  executor: ConnectionLike,
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> => {
  try {
    const [result] = await executor.execute(query, params);
    return {
      success: true,
      data: result as T,
    };
  } catch (error) {
    console.error('쿼리 실행 실패:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const executeTransactionInternal = async (
  connection: Connection,
  queries: TransactionQuery[]
): Promise<TransactionResult> => {
  try {
    await connection.beginTransaction();
    const results: any[] = [];

    for (const query of queries) {
      const [result] = await connection.execute(query.query, query.params ?? []);
      results.push(result);
    }

    await connection.commit();
    return {
      success: true,
      data: results,
    };
  } catch (error) {
    await connection.rollback();
    return {
      success: false,
      error: error as Error,
    };
  }
};

const backupInternal = async (connection: Connection, backupPath: string): Promise<QueryResult> => {
  try {
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const [tables] = await connection.execute<RowDataPacket[]>('SHOW TABLES');
    const backupData: Record<string, any[]> = {};

    for (const table of tables) {
      const tableName = Object.values(table)[0] as string;
      const [rows] = await connection.execute<RowDataPacket[]>(`SELECT * FROM ${tableName}`);
      backupData[tableName] = rows;
    }

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    return {
      success: true,
    };
  } catch (error) {
    console.error('백업 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const backupSchemaInternal = async (connection: Connection, backupPath: string): Promise<QueryResult> => {
  try {
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const [tables] = await connection.execute<RowDataPacket[]>('SHOW TABLES');
    const schemaData: Record<string, string> = {};

    for (const table of tables) {
      const tableName = Object.values(table)[0] as string;
      const [result] = await connection.execute<RowDataPacket[]>(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableStatement = result[0]['Create Table'] as string;
      schemaData[tableName] = createTableStatement;
    }

    fs.writeFileSync(backupPath, JSON.stringify(schemaData, null, 2));

    return {
      success: true,
    };
  } catch (error) {
    console.error('스키마 백업 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const restoreInternal = async (connection: Connection, backupPath: string): Promise<QueryResult> => {
  try {
    if (!fs.existsSync(backupPath)) {
      console.error('백업 파일을 찾을 수 없습니다:', backupPath);
      return {
        success: false,
        error: new Error('백업 파일을 찾을 수 없습니다.'),
      };
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    await connection.beginTransaction();
    try {
      for (const [tableName, data] of Object.entries(backupData)) {
        if (Array.isArray(data) && data.length > 0) {
          const columns = Object.keys(data[0]);
          const placeholders = columns.map(() => '?').join(',');
          const query = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

          for (const row of data) {
            await connection.execute(query, Object.values(row));
          }
        }
      }

      await connection.commit();
      return {
        success: true,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('복원 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const findInternal = async <T = RowDataPacket[]>(
  executor: ConnectionLike,
  table: string,
  options: FindOptions = {}
): Promise<QueryResult<T>> => {
  try {
    const fields = options.fields && options.fields.length > 0 ? options.fields.map(f => `\`${f}\``).join(', ') : '*';
    const { clause, params } = buildWhereClause(options.where);

    let query = `SELECT ${fields} FROM \`${table}\` ${clause}`;
    const queryParams = [...params];

    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    }

    if (typeof options.limit === 'number') {
      query += ` LIMIT ?`;
      queryParams.push(options.limit);
      if (typeof options.offset === 'number') {
        query += ` OFFSET ?`;
        queryParams.push(options.offset);
      }
    }

    const [rows] = await executor.execute(query, queryParams);
    return {
      success: true,
      data: rows as T,
    };
  } catch (error) {
    console.error('find 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const createInternal = async (
  executor: ConnectionLike,
  table: string,
  data: Record<string, any>
): Promise<QueryResult<ResultSetHeader>> => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('삽입할 데이터가 필요합니다.');
    }

    const columns = Object.keys(data).map(key => `\`${key}\``).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.keys(data).map(key => data[key]);

    const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
    const [result] = await executor.execute<ResultSetHeader>(query, values);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('create 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const updateInternal = async (
  executor: ConnectionLike,
  table: string,
  options: UpdateOptions
): Promise<QueryResult<ResultSetHeader>> => {
  try {
    if (!options?.data || Object.keys(options.data).length === 0) {
      throw new Error('업데이트할 데이터가 필요합니다.');
    }
    if (!options.where || Object.keys(options.where).length === 0) {
      throw new Error('업데이트 조건이 필요합니다.');
    }

    const { clause: setClause, params: setParams } = buildSetClause(options.data);
    const { clause: whereClause, params: whereParams } = buildWhereClause(options.where);

    const query = `UPDATE \`${table}\` SET ${setClause} ${whereClause}`;
    const [result] = await executor.execute<ResultSetHeader>(query, [...setParams, ...whereParams]);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('update 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const upsertInternal = async (
  executor: ConnectionLike,
  table: string,
  options: UpsertOptions
): Promise<QueryResult<ResultSetHeader>> => {
  try {
    const insertData = options.data;
    if (!insertData || Object.keys(insertData).length === 0) {
      throw new Error('업서트할 데이터가 필요합니다.');
    }

    const updateData = options.updateData && Object.keys(options.updateData).length > 0 ? options.updateData : insertData;

    const columns = Object.keys(insertData).map(key => `\`${key}\``).join(', ');
    const placeholders = Object.keys(insertData)
      .map(() => '?')
      .join(', ');
    const insertValues = Object.keys(insertData).map(key => insertData[key]);

    const { clause: updateClause, params: updateParams } = buildSetClause(updateData);

    const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause}`;
    const [result] = await executor.execute<ResultSetHeader>(query, [...insertValues, ...updateParams]);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('upsert 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const deleteInternal = async (
  executor: ConnectionLike,
  table: string,
  where: Record<string, any>
): Promise<QueryResult<ResultSetHeader>> => {
  try {
    if (!where || Object.keys(where).length === 0) {
      throw new Error('삭제 조건이 필요합니다.');
    }

    const { clause, params } = buildWhereClause(where);
    const query = `DELETE FROM \`${table}\` ${clause}`;
    const [result] = await executor.execute<ResultSetHeader>(query, params);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('delete 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

class Mysql {
  private pool: Pool;

  constructor(private readonly config: MySqlConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database ?? 'mysql',
      port: config.port ?? 3306,
      waitForConnections: true,
      connectionLimit: config.connectionLimit ?? 10,
      queueLimit: 0,
    });
  }

  getPool(): Pool {
    return this.pool;
  }

  async getConnection(): Promise<Connection> {
    return this.pool.getConnection();
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async executeQuery<T = any>(
    query: string,
    params: any[] = [],
    connection?: Connection
  ): Promise<QueryResult<T>> {
    const executor = this.getExecutor(connection);
    return executeQueryInternal<T>(executor, query, params);
  }

  async executeTransaction(queries: TransactionQuery[], connection?: Connection): Promise<TransactionResult> {
    return this.withConnection(connection, conn => executeTransactionInternal(conn, queries));
  }

  async backup(backupPath: string, connection?: Connection): Promise<QueryResult> {
    return this.withConnection(connection, conn => backupInternal(conn, backupPath));
  }

  async restore(backupPath: string, connection?: Connection): Promise<QueryResult> {
    return this.withConnection(connection, conn => restoreInternal(conn, backupPath));
  }

  async backupSchema(backupPath: string, connection?: Connection): Promise<QueryResult> {
    return this.withConnection(connection, conn => backupSchemaInternal(conn, backupPath));
  }

  async find<T = RowDataPacket[]>(
    table: string,
    options: FindOptions = {},
    connection?: Connection
  ): Promise<QueryResult<T>> {
    const executor = this.getExecutor(connection);
    return findInternal<T>(executor, table, options);
  }

  async findOne<T = RowDataPacket>(
    table: string,
    options: FindOptions = {},
    connection?: Connection
  ): Promise<QueryResult<T | null>> {
    const executor = this.getExecutor(connection);
    const mergedOptions: FindOptions = { ...options, limit: 1 };
    const result = await findInternal<RowDataPacket[]>(executor, table, mergedOptions);
    if (!result.success) {
      return result as QueryResult<T | null>;
    }
    const rows = result.data as RowDataPacket[];
    return {
      success: true,
      data: rows && rows.length > 0 ? (rows[0] as unknown as T) : null,
    };
  }

  async create(
    table: string,
    data: Record<string, any>,
    connection?: Connection
  ): Promise<QueryResult<ResultSetHeader>> {
    const executor = this.getExecutor(connection);
    return createInternal(executor, table, data);
  }

  async update(
    table: string,
    options: UpdateOptions,
    connection?: Connection
  ): Promise<QueryResult<ResultSetHeader>> {
    const executor = this.getExecutor(connection);
    return updateInternal(executor, table, options);
  }

  async upsert(
    table: string,
    options: UpsertOptions,
    connection?: Connection
  ): Promise<QueryResult<ResultSetHeader>> {
    const executor = this.getExecutor(connection);
    return upsertInternal(executor, table, options);
  }

  async delete(
    table: string,
    where: Record<string, any>,
    connection?: Connection
  ): Promise<QueryResult<ResultSetHeader>> {
    const executor = this.getExecutor(connection);
    return deleteInternal(executor, table, where);
  }

  private getExecutor(connection?: Connection): ConnectionLike {
    return connection ?? this.pool;
  }

  private async withConnection<T>(connection: Connection | undefined, fn: (conn: Connection) => Promise<T>): Promise<T> {
    if (connection) {
      return fn(connection);
    }

    const pooledConnection = await this.pool.getConnection();
    try {
      return await fn(pooledConnection);
    } finally {
      pooledConnection.release();
    }
  }
}

const executeQuery = async <T = any>(
  connection: Connection,
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> => executeQueryInternal<T>(connection, query, params);

const executeTransaction = async (connection: Connection, queries: TransactionQuery[]): Promise<TransactionResult> =>
  executeTransactionInternal(connection, queries);

const backup = async (connection: Connection, backupPath: string): Promise<QueryResult> =>
  backupInternal(connection, backupPath);

const restore = async (connection: Connection, backupPath: string): Promise<QueryResult> =>
  restoreInternal(connection, backupPath);

const backupSchema = async (connection: Connection, backupPath: string): Promise<QueryResult> =>
  backupSchemaInternal(connection, backupPath);

const find = async <T = RowDataPacket[]>(
  connection: ConnectionLike,
  table: string,
  options: FindOptions = {}
): Promise<QueryResult<T>> => findInternal<T>(connection, table, options);

const findOne = async <T = RowDataPacket>(
  connection: ConnectionLike,
  table: string,
  options: FindOptions = {}
): Promise<QueryResult<T | null>> => {
  const mergedOptions: FindOptions = { ...options, limit: 1 };
  const result = await findInternal<RowDataPacket[]>(connection, table, mergedOptions);
  if (!result.success) {
    return result as QueryResult<T | null>;
  }
  const rows = result.data as RowDataPacket[];
  return {
    success: true,
    data: rows && rows.length > 0 ? (rows[0] as unknown as T) : null,
  };
};

const create = async (
  connection: ConnectionLike,
  table: string,
  data: Record<string, any>
): Promise<QueryResult<ResultSetHeader>> => createInternal(connection, table, data);

const update = async (
  connection: ConnectionLike,
  table: string,
  options: UpdateOptions
): Promise<QueryResult<ResultSetHeader>> => updateInternal(connection, table, options);

const upsert = async (
  connection: ConnectionLike,
  table: string,
  options: UpsertOptions
): Promise<QueryResult<ResultSetHeader>> => upsertInternal(connection, table, options);

const deleteRows = async (
  connection: ConnectionLike,
  table: string,
  where: Record<string, any>
): Promise<QueryResult<ResultSetHeader>> => deleteInternal(connection, table, where);

export {
  Mysql,
  MySqlConfig,
  QueryResult,
  TransactionQuery,
  TransactionResult,
  FindOptions,
  UpdateOptions,
  UpsertOptions,
  executeQuery,
  executeTransaction,
  backup,
  restore,
  backupSchema,
  find,
  findOne,
  create,
  update,
  upsert,
  deleteRows,
};

export { deleteRows as delete };
