# Prisma 8 + Neon Database Workflow

This document contains the commands for managing Prisma migrations and synchronizing the database schema with Neon PostgreSQL.

## 1. Initial Database Setup

Run these commands when setting up a new database for the first time.

```bash
# Generate Prisma contract
pnpm prisma contract emit

# Create initial migration
pnpm prisma migration plan --name init

# Apply migration to the database
pnpm prisma db migrate

# Verify database schema
pnpm prisma db verify --db "$DATABASE_URL"

# Check migration status
pnpm prisma migration status
```

## 2. Schema Changes

Whenever you modify Prisma schema files, follow this workflow.

```bash
# Generate updated contract
pnpm prisma contract emit

# Create a migration plan
pnpm prisma migration plan --name <migration_name>

# Review generated migration
# Location: src/prisma/migrations/app/

# Apply migration
pnpm prisma db migrate

# Verify database schema
pnpm prisma db verify --db "$DATABASE_URL"

# Check migration status
pnpm prisma migration status
```

Example:

```bash
pnpm prisma migration plan --name add_user_profile
```

## 3. Database Inspection

Useful commands for checking the database and migration history.

```bash
# Verify database connection and schema
pnpm prisma db verify --db "$DATABASE_URL"

# View migration graph
pnpm prisma migration graph

# List migration references
pnpm prisma migration ref list

# Check migration status
pnpm prisma migration status

# Test PostgreSQL connection
psql "$DATABASE_URL" -c "SELECT version();"
```

## 4. Important Rules

1. Always run `pnpm prisma contract emit` after changing Prisma schema files.
2. Always review the generated migration before applying it.
3. `pnpm prisma migration plan` creates a migration plan; it does not apply it.
4. `pnpm prisma db migrate` applies migrations to the configured database.
5. Never delete the migration directory to fix migration errors.
6. Keep migration history committed to Git.
7. Back up production databases before applying migrations.
8. Verify that `DATABASE_URL` points to the intended database before applying migrations.
9. Do not run `db sign` or `db init` unless there is a specific reason.

## 5. Environment

Make sure the correct database URL is configured in your environment file.

```env
DATABASE_URL="your_neon_database_url"
```

Never commit database credentials or `.env` files to Git.

## 6. Recommended Workflow Summary

For every schema change:

```bash
pnpm prisma contract emit
pnpm prisma migration plan --name <migration_name>
pnpm prisma db migrate
pnpm prisma db verify --db "$DATABASE_URL"
pnpm prisma migration status
```

**Expected result:** Database schema matches the Prisma contract and migration status reports `Up to date`.