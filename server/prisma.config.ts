import dotenv from 'dotenv';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

dotenv.config({ path: ['.env.local', '.env.prod', '.env.test', '.env'] });

const prismaConfig: ReturnType<typeof definePrismaConfig> = definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/models/**/*.prisma',
    output: './src/prisma/generated/',
    migrations: { dir: './src/prisma/migrations' },
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});

export default prismaConfig;
