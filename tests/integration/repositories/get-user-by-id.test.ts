import { GetUserByIdRepository } from "../../../src/repositories/users/get-user-by-id"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"

describe("GetUserByIdRepository", () => {
  it("should return a user by id", async () => {
    const createRepo = new CreateUserRepository()
    const sut = new GetUserByIdRepository()

    const created = await createRepo.createUser({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    })

    const found = await sut.getUserById(created.id)

    expect(found).toBeDefined()
    expect(found?.id).toBe(created.id)
    expect(found?.name).toBe("any_name")
    expect(found?.email).toBe("any_email")
    expect(found?.password).toBe("any_password")
  })

  it("should return null if user does not exist", async () => {
    const sut = new GetUserByIdRepository()

    const found = await sut.getUserById("550e8400-e29b-41d4-a716-446655440000")

    expect(found).toBeNull()
  })
})
