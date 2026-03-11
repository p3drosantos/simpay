import { IGetUserByIdRepository } from "../../controllers/users/protocols.js"
import { User } from "../../models/user.js"

import "dotenv/config"

import * as schema from "../../db/schema.js"
import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async getUserById(id: string): Promise<User | null> {
    const table = schema.userTable

    const user = await db.select().from(table).where(eq(table.id, id)).limit(1)
    return user[0] || null
  }
}
