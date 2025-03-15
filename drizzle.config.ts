import { defineConfig } from 'drizzle-kit';
import * as dotenv from "dotenv"

dotenv.config({
  path: ".env.local"
})

export default defineConfig({
  out: './src/server/migrations',
  schema: './src/server/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRESQL_DB!
  },
});