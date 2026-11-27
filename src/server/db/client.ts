import 'server-only';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// The WebSocket driver supports transactions (intake writes several records at once).
neonConfig.webSocketConstructor = ws;

let instance: NeonDatabase<typeof schema> | undefined;

/** The handle inside `getDb().transaction(async (tx) => …)`; services pass it to each other to share one transaction. */
export type Tx = Parameters<Parameters<NeonDatabase<typeof schema>['transaction']>[0]>[0];

/**
 * The one database connection. Import only from src/server/services.
 * Created on first use, so `next build` works without DATABASE_URL; a request without it fails with a clear error.
 */
export function getDb(): NeonDatabase<typeof schema> {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
    instance = drizzle({ client: new Pool({ connectionString: url }), schema });
  }
  return instance;
}
