import { CreateUserRepository } from "../../../src/repositories/users/create-user"
import { GetUserByEmailRepository } from "../../../src/repositories/users/get-user-by-email"

describe("GetUserByEmailRepository", () => {
  it("should return a user by email", async () => {
    const createRepo = new CreateUserRepository()
    const sut = new GetUserByEmailRepository()

    const created = await createRepo.createUser({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    })

    const found = await sut.getUserByEmail("any_email")

    expect(found).toBeDefined()
    expect(found?.id).toBe(created.id)
    expect(found?.name).toBe("any_name")
    expect(found?.email).toBe("any_email")
    expect(found?.password).toBe("any_password")
  })

  it("should return null if user does not exist", async () => {
    const sut = new GetUserByEmailRepository()

    const found = await sut.getUserByEmail("notfound@test.com")

    expect(found).toBeNull()
  })
})
