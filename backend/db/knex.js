import knexLib from 'knex';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Single shared Knex/Postgres connection for the whole app.
 * Configure via DATABASE_URL, or the discrete PG* variables (see .env.example).
 */
const connection = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
      }
    : {
          host: process.env.PGHOST || 'localhost',
          port: Number(process.env.PGPORT || 5432),
          user: process.env.PGUSER || 'postgres',
          password: process.env.PGPASSWORD || 'postgres',
          database: process.env.PGDATABASE || 'insuresense',
          ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
      };

const knex = knexLib({
    client: 'pg',
    connection,
    pool: { min: 0, max: 10 },
});

export default knex;
