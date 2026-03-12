import { db } from "./src/db/client"
import { sql } from "drizzle-orm"

beforeEach(async () => {
  console.log("TRUNCATING TABLES")
  await db.execute(sql`
    TRUNCATE TABLE "events", "users" RESTART IDENTITY CASCADE
  `)
})
