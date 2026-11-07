#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/57e76f7f931c9c6efa2ce786bf6aa69169d234cae79255305ffdd292257f2be5/contract';
import endContract from '../../snapshots/57e76f7f931c9c6efa2ce786bf6aa69169d234cae79255305ffdd292257f2be5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f251a4935ad5098073e52407e4d4e8f35feafec0bdcc521a4523cdf28c273d98/contract';
import startContract from '../../snapshots/f251a4935ad5098073e52407e4d4e8f35feafec0bdcc521a4523cdf28c273d98/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  lit,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'google_accounts', column: 'scope' }),
      this.addColumn({
        schema: 'public',
        table: 'mcp_client_accesses',
        column: col('scopes', 'text[]', {
          notNull: true,
          default: lit([]),
          codecRef: { codecId: 'pg/text@1', many: true },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'mcp_clients',
        column: col('scopes', 'text[]', {
          notNull: true,
          default: lit([]),
          codecRef: { codecId: 'pg/text@1', many: true },
        }),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        column: 'scope',
        type: 'text[]',
        using: sql`CASE
          WHEN "scope" IS NULL OR btrim("scope") = '' THEN ARRAY[]::text[]
          ELSE ARRAY(
            SELECT CASE lower(value)
              WHEN 'drive:read' THEN 'DRIVE_READ'
              WHEN 'drive:write' THEN 'DRIVE_WRITE'
              ELSE value
            END
            FROM unnest(regexp_split_to_array(btrim("scope"), '\\s+')) AS parts(value)
          )
        END`,
      }),
      this.setDefault({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        column: col('scope', 'text[]', {
          default: lit([]),
          codecRef: { codecId: 'pg/text@1', many: true },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'mcp_client_accesses',
        constraint: 'mcp_client_accesses_scopes_check_5643ef4f',
        expression: sql`array_remove("scopes", NULL) <@ '{"DRIVE_READ","DRIVE_WRITE"}'`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'mcp_client_accesses',
        constraint: 'mcp_client_accesses_scopes_elem_not_null_de6fcc8e',
        expression: sql`array_position("scopes", NULL) IS NULL`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'mcp_clients',
        constraint: 'mcp_clients_scopes_check_5643ef4f',
        expression: sql`array_remove("scopes", NULL) <@ '{"DRIVE_READ","DRIVE_WRITE"}'`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'mcp_clients',
        constraint: 'mcp_clients_scopes_elem_not_null_de6fcc8e',
        expression: sql`array_position("scopes", NULL) IS NULL`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        constraint: 'mcp_refresh_tokens_scope_check_9799e96d',
        expression: sql`array_remove("scope", NULL) <@ '{"DRIVE_READ","DRIVE_WRITE"}'`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        constraint: 'mcp_refresh_tokens_scope_elem_not_null_e633fc0c',
        expression: sql`array_position("scope", NULL) IS NULL`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
