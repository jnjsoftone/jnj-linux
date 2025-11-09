/**
 * Type definitions for env.config.js
 * Provides type safety for environment configuration
 */

export interface MysqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
}

export interface GraphQLConfig {
  port: number;
  introspection: boolean;
  playground: boolean;
}

export interface RestConfig {
  port: number;
}

export interface CorsConfig {
  origin: string;
}

export interface EnvConfig {
  mysql: MysqlConfig;
  postgres: PostgresConfig;
  server: ServerConfig;
  graphql: GraphQLConfig;
  rest: RestConfig;
  cors: CorsConfig;
}

declare const envConfig: EnvConfig;
export = envConfig;
