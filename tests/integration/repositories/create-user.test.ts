import { CreateUserRepository } from "../../../src/repositories/users/create-user"
import { db } from "../../../src/db/client"
import * as schema from "../../../src/db/schema"

describe("CreateUserRepository", () => {
  it("should create a new user successfully", async () => {
    const sut = new CreateUserRepository()

    const result = await sut.createUser({
      name: "any_name",
      email: "any_email",
      password: "any_password",
      role: "customer" as const,
    })

    expect(result.name).toBe("any_name")
    expect(result.email).toBe("any_email")
    expect(result.password).toBe("any_password")
  })

  it("should persist user in database", async () => {
    const sut = new CreateUserRepository()

    const created = await sut.createUser({
      name: "db_name",
      email: "db_email",
      password: "db_password",
      role: "customer" as const,
    })

    const users = await db.select().from(schema.userTable)

    const found = users.find((u) => u.id === created.id)

    expect(found).toBeDefined()
    expect(found?.email).toBe("db_email")
  })
})
