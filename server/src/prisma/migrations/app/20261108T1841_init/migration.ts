#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6d5ebd2452ca7b4f904719751cdb56f967b261beff80dd7c947841ccbafbc333/contract';
import endContract from '../../snapshots/6d5ebd2452ca7b4f904719751cdb56f967b261beff80dd7c947841ccbafbc333/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'auth_sessions',
        columns: [
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('expires_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('revoked_at', 'timestamptz(3)', {
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('token_hash', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('user_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'google_accounts',
        columns: [
          col('access_token', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('email', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('expires_at', 'timestamptz(3)', {
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('google_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('refresh_token', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('user_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'mcp_client_accesses',
        columns: [
          col('client_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('granted_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('revoked_at', 'timestamptz(3)', {
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('user_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'mcp_clients',
        columns: [
          col('client_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('client_secret_hash', 'text', {
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('name', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('redirect_uris', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('updated_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'mcp_clients_redirect_uris_elem_not_null_3825312c',
            sql`array_position("redirect_uris", NULL) IS NULL`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        columns: [
          col('client_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('expires_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('revoked_at', 'timestamptz(3)', {
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('token_hash', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('user_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'mcp_tool_accesses',
        columns: [
          col('client_access_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('is_enabled', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('tool_name', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('email', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('google_id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('picture', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'auth_sessions',
        constraint: 'auth_sessions_token_hash_key',
        columns: ['token_hash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'google_accounts',
        constraint: 'google_accounts_user_id_key',
        columns: ['user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'google_accounts',
        constraint: 'google_accounts_google_id_key',
        columns: ['google_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'mcp_client_accesses',
        constraint: 'mcp_client_accesses_user_id_client_id_key',
        columns: ['user_id', 'client_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'mcp_clients',
        constraint: 'mcp_clients_client_id_key',
        columns: ['client_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        constraint: 'mcp_refresh_tokens_token_hash_key',
        columns: ['token_hash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'mcp_tool_accesses',
        constraint: 'mcp_tool_accesses_client_access_id_tool_name_key',
        columns: ['client_access_id', 'tool_name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_google_id_key',
        columns: ['google_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'auth_sessions',
        index: 'auth_sessions_expires_at_idx_35365ada',
        columns: ['expires_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'auth_sessions',
        index: 'auth_sessions_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_client_accesses',
        index: 'mcp_client_accesses_client_id_idx_1bb5a570',
        columns: ['client_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_client_accesses',
        index: 'mcp_client_accesses_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        index: 'mcp_refresh_tokens_client_id_idx_1bb5a570',
        columns: ['client_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        index: 'mcp_refresh_tokens_expires_at_idx_35365ada',
        columns: ['expires_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        index: 'mcp_refresh_tokens_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_tool_accesses',
        index: 'mcp_tool_accesses_client_access_id_idx_079334d7',
        columns: ['client_access_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mcp_tool_accesses',
        index: 'mcp_tool_accesses_tool_name_idx_081476e4',
        columns: ['tool_name'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'auth_sessions',
        foreignKey: {
          name: 'auth_sessions_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'google_accounts',
        foreignKey: {
          name: 'google_accounts_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mcp_client_accesses',
        foreignKey: {
          name: 'mcp_client_accesses_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mcp_client_accesses',
        foreignKey: {
          name: 'mcp_client_accesses_client_id_fkey',
          columns: ['client_id'],
          references: {
            schema: 'public',
            table: 'mcp_clients',
            columns: ['client_id'],
          },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        foreignKey: {
          name: 'mcp_refresh_tokens_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        foreignKey: {
          name: 'mcp_refresh_tokens_client_id_fkey',
          columns: ['client_id'],
          references: {
            schema: 'public',
            table: 'mcp_clients',
            columns: ['client_id'],
          },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mcp_tool_accesses',
        foreignKey: {
          name: 'mcp_tool_accesses_client_access_id_fkey',
          columns: ['client_access_id'],
          references: {
            schema: 'public',
            table: 'mcp_client_accesses',
            columns: ['id'],
          },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
