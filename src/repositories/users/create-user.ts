import { ICreateUserRepository } from "../../controllers/users/protocols.js"
import { drizzle } from "drizzle-orm/node-postgres"
import { User } from "../../models/user.js"
import { CreateUserInput } from "../../validators/create-user.schema.js"
import "dotenv/config"

import * as schema from "../../db/schema.js"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class CreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserInput): Promise<User> {
    const table = schema.userTable

    const [user] = await db
      .insert(table)
      .values({
        name: params.name,
        email: params.email,
        password: params.password,
      })
      .returning()

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: new Date(user.createdAt),
    }
  }
}
