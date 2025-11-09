import { Pool, PoolClient, QueryResult as PgQueryResult } from 'pg';
import fs from 'fs';
import path from 'path';

interface PostgresConfig {
  host: string;
  user: string;
  password: string;
  database: string;
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
  conflictColumns?: string[];
  conflictConstraint?: string;
}

type PgExecutor = Pool | PoolClient;

const buildWhereClause = (where: Record<string, any> | undefined, startIndex = 1) => {
  if (!where || Object.keys(where).length === 0) {
    return { clause: '', params: [] as any[], nextIndex: startIndex };
  }

  const keys = Object.keys(where);
  const conditions = keys.map((key, idx) => `"${key}" = $${startIndex + idx}`);
  const params = keys.map(key => where[key]);

  return {
    clause: `WHERE ${conditions.join(' AND ')}`,
    params,
    nextIndex: startIndex + keys.length,
  };
};

const buildSetClause = (data: Record<string, any>, startIndex = 1) => {
  const keys = Object.keys(data);
  const assignments = keys.map((key, idx) => `"${key}" = $${startIndex + idx}`);
  const params = keys.map(key => data[key]);

  return {
    clause: assignments.join(', '),
    params,
    nextIndex: startIndex + keys.length,
  };
};

const executeQueryInternal = async <T = any>(
  executor: PgExecutor,
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> => {
  try {
    const result: PgQueryResult = await executor.query(query, params);
    return {
      success: true,
      data: result.rows as unknown as T,
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
  client: PoolClient,
  queries: TransactionQuery[]
): Promise<TransactionResult> => {
  try {
    await client.query('BEGIN');
    const results: any[] = [];

    for (const query of queries) {
      const result = await client.query(query.query, query.params ?? []);
      results.push(result.rows);
    }

    await client.query('COMMIT');
    return {
      success: true,
      data: results,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    return {
      success: false,
      error: error as Error,
    };
  }
};

const backupInternal = async (client: PoolClient, backupPath: string): Promise<QueryResult<string[]>> => {
  try {
    const { rows } = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );

    if (rows.length === 0) {
      throw new Error('백업할 테이블이 없습니다.');
    }

    const tables: Record<string, any[]> = {};
    for (const { table_name } of rows) {
      const result = await client.query(`SELECT * FROM "${table_name}"`);
      tables[table_name] = result.rows;
    }

    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    await fs.promises.writeFile(backupPath, JSON.stringify(tables, null, 2));

    return {
      success: true,
      data: Object.keys(tables),
    };
  } catch (error) {
    console.error('백업 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

const restoreInternal = async (client: PoolClient, backupPath: string): Promise<QueryResult> => {
  try {
    if (!fs.existsSync(backupPath)) {
      return {
        success: false,
        error: new Error('백업 파일을 찾을 수 없습니다.'),
      };
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    await client.query('BEGIN');
    try {
      for (const [tableName, data] of Object.entries(backupData)) {
        if (Array.isArray(data) && data.length > 0) {
          const columns = Object.keys(data[0]);
          const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
          const query = `INSERT INTO "${tableName}" (${columns.map(col => `"${col}"`).join(', ')}) VALUES (${placeholders})`;

          for (const row of data) {
            await client.query(query, columns.map(col => (row as Record<string, any>)[col]));
          }
        }
      }

      await client.query('COMMIT');
      return {
        success: true,
      };
    } catch (error) {
      await client.query('ROLLBACK');
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

const findInternal = async <T = any>(
  executor: PgExecutor,
  table: string,
  options: FindOptions = {}
): Promise<QueryResult<T>> => {
  try {
    const fields =
      options.fields && options.fields.length > 0 ? options.fields.map(field => `"${field}"`).join(', ') : '*';

    const { clause: whereClause, params, nextIndex } = buildWhereClause(options.where);
    let query = `SELECT ${fields} FROM "${table}" ${whereClause}`;
    const queryParams = [...params];
    let nextParamIndex = nextIndex;

    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    }

    if (typeof options.limit === 'number') {
      query += ` LIMIT $${nextParamIndex++}`;
      queryParams.push(options.limit);
      if (typeof options.offset === 'number') {
        query += ` OFFSET $${nextParamIndex++}`;
        queryParams.push(options.offset);
      }
    }

    const result = await executor.query(query, queryParams);
    return {
      success: true,
      data: result.rows as unknown as T,
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
  executor: PgExecutor,
  table: string,
  data: Record<string, any>
): Promise<QueryResult<PgQueryResult>> => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('삽입할 데이터가 필요합니다.');
    }

    const columns = Object.keys(data);
    const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
    const values = columns.map(column => data[column]);

    const query = `INSERT INTO "${table}" (${columns.map(col => `"${col}"`).join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await executor.query(query, values);

    return {
      success: true,
      data: result as unknown as PgQueryResult,
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
  executor: PgExecutor,
  table: string,
  options: UpdateOptions
): Promise<QueryResult<PgQueryResult>> => {
  try {
    if (!options?.data || Object.keys(options.data).length === 0) {
      throw new Error('업데이트할 데이터가 필요합니다.');
    }
    if (!options.where || Object.keys(options.where).length === 0) {
      throw new Error('업데이트 조건이 필요합니다.');
    }

    const { clause: setClause, params: setParams, nextIndex } = buildSetClause(options.data);
    const { clause: whereClause, params: whereParams } = buildWhereClause(options.where, nextIndex);

    const query = `UPDATE "${table}" SET ${setClause} ${whereClause} RETURNING *`;
    const result = await executor.query(query, [...setParams, ...whereParams]);

    return {
      success: true,
      data: result as unknown as PgQueryResult,
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
  executor: PgExecutor,
  table: string,
  options: UpsertOptions
): Promise<QueryResult<PgQueryResult>> => {
  try {
    const insertData = options.data;
    if (!insertData || Object.keys(insertData).length === 0) {
      throw new Error('업서트할 데이터가 필요합니다.');
    }

    const conflictClause = options.conflictConstraint
      ? `ON CONFLICT ON CONSTRAINT ${options.conflictConstraint}`
      : options.conflictColumns && options.conflictColumns.length > 0
      ? `ON CONFLICT (${options.conflictColumns.map(col => `"${col}"`).join(', ')})`
      : null;

    if (!conflictClause) {
      throw new Error('conflict 대상이 필요합니다. conflictColumns 또는 conflictConstraint를 지정하세요.');
    }

    const updateData =
      options.updateData && Object.keys(options.updateData).length > 0 ? options.updateData : insertData;

    const insertColumns = Object.keys(insertData);
    const insertPlaceholders = insertColumns.map((_, idx) => `$${idx + 1}`).join(', ');
    const insertValues = insertColumns.map(column => insertData[column]);

    const updateAssignments = Object.keys(updateData)
      .map(column => `"${column}" = EXCLUDED."${column}"`)
      .join(', ');

    const query = `INSERT INTO "${table}" (${insertColumns.map(col => `"${col}"`).join(', ')}) VALUES (${insertPlaceholders}) ${conflictClause} DO UPDATE SET ${updateAssignments} RETURNING *`;

    const result = await executor.query(query, insertValues);

    return {
      success: true,
      data: result as unknown as PgQueryResult,
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
  executor: PgExecutor,
  table: string,
  where: Record<string, any>
): Promise<QueryResult<PgQueryResult>> => {
  try {
    if (!where || Object.keys(where).length === 0) {
      throw new Error('삭제 조건이 필요합니다.');
    }

    const { clause, params } = buildWhereClause(where);
    const query = `DELETE FROM "${table}" ${clause} RETURNING *`;
    const result = await executor.query(query, params);

    return {
      success: true,
      data: result as unknown as PgQueryResult,
    };
  } catch (error) {
    console.error('delete 실행 중 오류:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
};

class Postgres {
  private pool: Pool;

  constructor(private readonly config: PostgresConfig) {
    this.pool = new Pool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port ?? 5432,
      max: config.connectionLimit ?? 10,
    });
  }

  getPool(): Pool {
    return this.pool;
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async executeQuery<T = any>(
    query: string,
    params: any[] = [],
    client?: PoolClient
  ): Promise<QueryResult<T>> {
    const executor = this.getExecutor(client);
    return executeQueryInternal<T>(executor, query, params);
  }

  async executeTransaction(queries: TransactionQuery[], client?: PoolClient): Promise<TransactionResult> {
    return this.withClient(client, pooledClient => executeTransactionInternal(pooledClient, queries));
  }

  async backup(backupPath: string, client?: PoolClient): Promise<QueryResult<string[]>> {
    return this.withClient(client, pooledClient => backupInternal(pooledClient, backupPath));
  }

  async restore(backupPath: string, client?: PoolClient): Promise<QueryResult> {
    return this.withClient(client, pooledClient => restoreInternal(pooledClient, backupPath));
  }

  async find<T = any>(
    table: string,
    options: FindOptions = {},
    client?: PoolClient
  ): Promise<QueryResult<T>> {
    const executor = this.getExecutor(client);
    return findInternal<T>(executor, table, options);
  }

  async findOne<T = any>(
    table: string,
    options: FindOptions = {},
    client?: PoolClient
  ): Promise<QueryResult<T | null>> {
    const executor = this.getExecutor(client);
    const mergedOptions: FindOptions = { ...options, limit: 1 };
    const result = await findInternal<T[]>(executor, table, mergedOptions);
    if (!result.success) {
      return result as QueryResult<T | null>;
    }
    const rows = result.data as unknown as T[];
    return {
      success: true,
      data: rows && rows.length > 0 ? rows[0] : null,
    };
  }

  async create(
    table: string,
    data: Record<string, any>,
    client?: PoolClient
  ): Promise<QueryResult<PgQueryResult>> {
    const executor = this.getExecutor(client);
    return createInternal(executor, table, data);
  }

  async update(
    table: string,
    options: UpdateOptions,
    client?: PoolClient
  ): Promise<QueryResult<PgQueryResult>> {
    const executor = this.getExecutor(client);
    return updateInternal(executor, table, options);
  }

  async upsert(
    table: string,
    options: UpsertOptions,
    client?: PoolClient
  ): Promise<QueryResult<PgQueryResult>> {
    const executor = this.getExecutor(client);
    return upsertInternal(executor, table, options);
  }

  async delete(
    table: string,
    where: Record<string, any>,
    client?: PoolClient
  ): Promise<QueryResult<PgQueryResult>> {
    const executor = this.getExecutor(client);
    return deleteInternal(executor, table, where);
  }

  private getExecutor(client?: PoolClient): PgExecutor {
    return client ?? this.pool;
  }

  private async withClient<T>(client: PoolClient | undefined, fn: (pooled: PoolClient) => Promise<T>): Promise<T> {
    if (client) {
      return fn(client);
    }

    const pooledClient = await this.pool.connect();
    try {
      return await fn(pooledClient);
    } finally {
      pooledClient.release();
    }
  }
}

const executeQuery = async <T = any>(
  connection: PoolClient | Pool,
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> => executeQueryInternal<T>(connection, query, params);

const executeTransaction = async (connection: PoolClient, queries: TransactionQuery[]): Promise<TransactionResult> =>
  executeTransactionInternal(connection, queries);

const backup = async (connection: PoolClient, backupPath: string): Promise<QueryResult<string[]>> =>
  backupInternal(connection, backupPath);

const restore = async (connection: PoolClient, backupPath: string): Promise<QueryResult> =>
  restoreInternal(connection, backupPath);

const find = async <T = any>(
  connection: PgExecutor,
  table: string,
  options: FindOptions = {}
): Promise<QueryResult<T>> => findInternal<T>(connection, table, options);

const findOne = async <T = any>(
  connection: PgExecutor,
  table: string,
  options: FindOptions = {}
): Promise<QueryResult<T | null>> => {
  const mergedOptions: FindOptions = { ...options, limit: 1 };
  const result = await findInternal<T[]>(connection, table, mergedOptions);
  if (!result.success) {
    return result as QueryResult<T | null>;
  }
  const rows = result.data as unknown as T[];
  return {
    success: true,
    data: rows && rows.length > 0 ? rows[0] : null,
  };
};

const create = async (
  connection: PgExecutor,
  table: string,
  data: Record<string, any>
): Promise<QueryResult<PgQueryResult>> => createInternal(connection, table, data);

const update = async (
  connection: PgExecutor,
  table: string,
  options: UpdateOptions
): Promise<QueryResult<PgQueryResult>> => updateInternal(connection, table, options);

const upsert = async (
  connection: PgExecutor,
  table: string,
  options: UpsertOptions
): Promise<QueryResult<PgQueryResult>> => upsertInternal(connection, table, options);

const deleteRows = async (
  connection: PgExecutor,
  table: string,
  where: Record<string, any>
): Promise<QueryResult<PgQueryResult>> => deleteInternal(connection, table, where);

export {
  Postgres,
  PostgresConfig,
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
  find,
  findOne,
  create,
  update,
  upsert,
  deleteRows,
};

export { deleteRows as delete };
