import type { Config } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || 'postgresql://neondb_owner:npg_Wp08SgCnzwFt@ep-calm-rain-aei8g1fq-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: databaseUrl,
  },
} satisfies Config;