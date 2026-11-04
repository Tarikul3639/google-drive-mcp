import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './generated/contract';
import contractJson from './generated/contract.json' with { type: 'json' };

export const contract = contractFromJson<Contract>(contractJson);

export const db: PostgresClient<Contract> = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});
