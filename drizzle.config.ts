import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });
config();

// `generate` only reads the schema; every other command (migrate, push, studio) talks to the database.
const generating = process.argv.includes('generate');
const url = process.env.DATABASE_URL ?? '';
if (!url && !generating) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url,
  },
  strict: true,
  verbose: true,
});
