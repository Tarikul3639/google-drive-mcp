#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/d94ac06585d8696c789207247ab5a736ab6554b2d0313bfef15bc8f548255602/contract';
import startContract from '../../snapshots/d94ac06585d8696c789207247ab5a736ab6554b2d0313bfef15bc8f548255602/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f251a4935ad5098073e52407e4d4e8f35feafec0bdcc521a4523cdf28c273d98/contract';
import endContract from '../../snapshots/f251a4935ad5098073e52407e4d4e8f35feafec0bdcc521a4523cdf28c273d98/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'mcp_authorization_codes' }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'mcp_refresh_tokens',
        column: 'scope',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
