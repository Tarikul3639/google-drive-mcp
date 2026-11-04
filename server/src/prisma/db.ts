import dotenv from 'dotenv';
import postgres from '@prisma/orm-postgres/runtime';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './generated/contract';
import contractJson from './generated/contract.json' with { type: 'json' };

// Load environment variables from .env files in the following order of priority:
dotenv.config({ path: ['.env.local', '.env.prod', '.env.test', '.env'] });

// Create a Postgres client using the contract and the DATABASE_URL from environment variables
export const contract = contractFromJson<Contract>(contractJson);

// Create a Postgres client using the contract and the DATABASE_URL from environment variables
export const db: PostgresClient<Contract> = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});
