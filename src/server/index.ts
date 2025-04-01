import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "server/schema";
import * as actions from "./actions"; export { actions }
console.log(process.env.POSTGRESQL_DB)
const sql = neon(process.env.POSTGRESQL_DB!);
export const db = drizzle(sql, { schema, logger: true,  });