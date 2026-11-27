// Applies pending drizzle/ migrations on production deploys. `npm run vercel-build` runs it before `next build`;
// a failed migration exits non-zero, so the build fails and the new code never goes live against an old schema.
import { existsSync, readFileSync } from 'node:fs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { readMigrationFiles } from 'drizzle-orm/migrator';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import ws from 'ws';

const MIGRATIONS_FOLDER = 'drizzle';
const log = (message) => console.log(`[migrate-on-deploy] ${message}`);

// Decided from the real environment, before any .env file is read.
const vercelEnv = process.env.VERCEL_ENV;
if (vercelEnv !== 'production') {
  log(
    `Skipped: VERCEL_ENV is ${vercelEnv ? `"${vercelEnv}"` : 'not set'}; migrations run only on production deploys. ` +
      "Previews share production's DATABASE_URL, so migrating from one would change production's schema before " +
      'its code is merged. Use `npm run db:migrate` for local and Neon-branch databases.',
  );
  process.exit(0);
}

// Same files drizzle.config.ts reads, for running this by hand (Vercel has neither). dotenv never overwrites a
// variable that is already set.
const envFiles = ['.env.local', '.env'].filter((file) => existsSync(file));
if (envFiles.length > 0) {
  const { config } = await import('dotenv');
  for (const path of envFiles) config({ path });
}

// Migrations need a direct connection; the pooled one is only the fallback.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  log('Failed: neither DATABASE_URL_UNPOOLED nor DATABASE_URL is set.');
  process.exit(1);
}

/** Removes the connection string and its secret parts from text that could reach the build log. */
function redact(text) {
  const secrets = [url];
  try {
    const { password, username, host, hostname } = new URL(url);
    secrets.push(password, username, host, hostname);
  } catch {
    // Not a parseable URL: removing the whole string is all we can do.
  }
  return secrets
    .filter((secret) => secret && secret.length > 2)
    .reduce((out, secret) => out.split(secret).join('[redacted]'), String(text));
}

const tags = new Map(
  JSON.parse(readFileSync(`${MIGRATIONS_FOLDER}/meta/_journal.json`, 'utf8')).entries.map((e) => [e.when, e.tag]),
);
const fileOf = (migration) => `${MIGRATIONS_FOLDER}/${tags.get(migration.folderMillis)}.sql`;
const migrations = readMigrationFiles({ migrationsFolder: MIGRATIONS_FOLDER });

// drizzle's migrator doesn't say which migration failed, so follow its queries: it runs each migration's
// statements, then records the migration in drizzle.__drizzle_migrations with ($hash, $folderMillis).
const applied = [];
let lastQuery = '';
const logger = {
  logQuery(query, params) {
    lastQuery = query;
    if (/^insert into "drizzle"\."__drizzle_migrations"/.test(query)) applied.push(Number(params[1]));
  },
};

/** The migration whose statement was running when the migrator failed, if it got that far. */
function failedMigration() {
  const after = applied.length ? applied[applied.length - 1] : -Infinity;
  return migrations.find((m) => m.folderMillis > after && m.sql.includes(lastQuery));
}

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: url });

try {
  await migrate(drizzle({ client: pool, logger }), { migrationsFolder: MIGRATIONS_FOLDER });
  if (applied.length === 0) {
    log('No pending migrations.');
  } else {
    for (const millis of applied) log(`Applied ${fileOf({ folderMillis: millis })}`);
  }
} catch (error) {
  const failed = failedMigration();
  const where = failed ? `in ${fileOf(failed)}` : 'before any migration ran';
  // Migrations run in one transaction, so a failure rolls back every migration from this run.
  log(`Failed ${where}; no migrations from this deploy were applied.`);
  log(`Error: ${redact(error instanceof Error ? error.message : error)}`);
  process.exitCode = 1;
} finally {
  await pool.end().catch(() => {});
}
