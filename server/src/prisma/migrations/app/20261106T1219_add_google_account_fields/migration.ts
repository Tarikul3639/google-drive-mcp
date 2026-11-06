#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4f6acd32dfd3e27afa8b094bf496747db91e2b184af972e1cfa6b0a5de160415/contract';
import startContract from '../../snapshots/4f6acd32dfd3e27afa8b094bf496747db91e2b184af972e1cfa6b0a5de160415/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d94ac06585d8696c789207247ab5a736ab6554b2d0313bfef15bc8f548255602/contract';
import endContract from '../../snapshots/d94ac06585d8696c789207247ab5a736ab6554b2d0313bfef15bc8f548255602/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'oauth_states' }),
      this.addColumn({
        schema: 'public',
        table: 'google_accounts',
        column: col('scope', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dropNotNull({ schema: 'public', table: 'google_accounts', column: 'expires_at' }),
      this.dropNotNull({ schema: 'public', table: 'google_accounts', column: 'refresh_token' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
