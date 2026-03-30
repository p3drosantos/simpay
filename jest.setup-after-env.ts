import { db } from "./src/db/client"
import { sql } from "drizzle-orm"

beforeEach(async () => {
  await db.execute(sql`
    TRUNCATE TABLE "events", "users" RESTART IDENTITY CASCADE
  `)
})
