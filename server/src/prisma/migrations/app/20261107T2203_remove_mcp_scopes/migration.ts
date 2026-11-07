#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/57e76f7f931c9c6efa2ce786bf6aa69169d234cae79255305ffdd292257f2be5/contract';
import startContract from '../../snapshots/57e76f7f931c9c6efa2ce786bf6aa69169d234cae79255305ffdd292257f2be5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9c1d6f113b5dc3704391fcb92d6cf270c7c3d199a866673a80bae5e76e12ce2a/contract';
import endContract from '../../snapshots/9c1d6f113b5dc3704391fcb92d6cf270c7c3d199a866673a80bae5e76e12ce2a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'mcp_client_accesses',
        constraint: 'mcp_client_accesses_scopes_check_5643ef4f',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'mcp_client_accesses',
        constraint: 'mcp_client_accesses_scopes_elem_not_null_de6fcc8e',
      }),
      this.dropColumn({ schema: 'public', table: 'mcp_client_accesses', column: 'scopes' }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'mcp_clients',
        constraint: 'mcp_clients_scopes_check_5643ef4f',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'mcp_clients',
        constraint: 'mcp_clients_scopes_elem_not_null_de6fcc8e',
      }),
      this.dropColumn({ schema: 'public', table: 'mcp_clients', column: 'scopes' }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        constraint: 'mcp_refresh_tokens_scope_check_9799e96d',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        constraint: 'mcp_refresh_tokens_scope_elem_not_null_e633fc0c',
      }),
      this.dropColumn({ schema: 'public', table: 'mcp_refresh_tokens', column: 'scope' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
