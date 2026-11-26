import 'server-only';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// The WebSocket driver supports transactions (intake writes several records at once).
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/** The one database connection. Import only from src/server/services. */
export const db = drizzle({ client: pool, schema });
