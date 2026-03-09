import { CreateUserController } from "../../../src/controllers/users/create-user"
import { UserAlreadyExistsError } from "../../../src/errors/users/user-errors"

const makeSut = () => {
  const mockUseCase = {
    createUser: jest.fn(),
  }

  const sut = new CreateUserController(mockUseCase)

  return {
    sut,
    mockUseCase,
  }
}

const makeRequest = (overrides = {}) => ({
  body: {
    name: "Pedro Santos",
    email: "pedro.santos@example.com",
    password: "password123",
    ...overrides,
  },
})

describe("CreateUserController", () => {
  it("should create a user successfully", async () => {
    const { sut, mockUseCase } = makeSut()

    const date = new Date()

    mockUseCase.createUser.mockResolvedValue({
      id: "user-id",
      name: "Pedro Santos",
      email: "pedro.santos@example.com",
      password: "hashed-password",
      createdAt: date,
    })

    const request = makeRequest()

    const response = await sut.createUser(request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: "user-id",
      name: "Pedro Santos",
      email: "pedro.santos@example.com",
      createdAt: date,
    })
  })

  it("should return 400 if body is missing", async () => {
    const { sut } = makeSut()

    const response = await sut.createUser({})

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: "Missing body",
    })
  })

  it("should return 400 if  anywhere params is invalid", async () => {
    const { sut } = makeSut()

    const request = makeRequest({ email: "invalid_email" })

    const response = await sut.createUser(request)

    expect(response.statusCode).toBe(400)
  })

  it("should return 409 if user already exists", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.createUser.mockRejectedValue(new UserAlreadyExistsError())

    const request = makeRequest()

    const response = await sut.createUser(request)

    expect(response.statusCode).toBe(409)
    expect(response.body).toEqual({
      error: "User already exists",
    })
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.createUser.mockRejectedValue(new Error())

    const request = makeRequest()

    const response = await sut.createUser(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "Internal server error",
    })
  })
})
