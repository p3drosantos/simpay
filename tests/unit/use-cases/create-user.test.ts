import { UserAlreadyExistsError } from "../../../src/errors/users/user-errors"
import { CreateUserUseCase } from "../../../src/use-cases/users/create-user"

const makeSut = () => {
  const mockCreateUserRepository = {
    createUser: jest.fn(),
  }

  const mockGetUserByEmailRepository = {
    getUserByEmail: jest.fn(),
  }

  const mockHashGenerate = {
    hash: jest.fn(),
  }

  const sut = new CreateUserUseCase(
    mockCreateUserRepository,
    mockGetUserByEmailRepository,
    mockHashGenerate
  )

  return {
    sut,
    mockCreateUserRepository,
    mockGetUserByEmailRepository,
    mockHashGenerate,
  }
}

describe("CreateUserUseCase", () => {
  it("should create a new user successfully", async () => {
    const {
      sut,
      mockCreateUserRepository,
      mockGetUserByEmailRepository,
      mockHashGenerate,
    } = makeSut()

    const Makeparams = (overrides = {}) => {
      return {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        ...overrides,
      }
    }

    mockCreateUserRepository.createUser.mockResolvedValue({
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "any_password",
      createdAt: new Date("2028-01-01"),
    })

    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue(null)

    mockHashGenerate.hash.mockResolvedValue("hashed_password")

    const user = await sut.createUser(Makeparams())

    expect(user).toEqual({
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "any_password",
      createdAt: new Date("2028-01-01"),
    })

    expect(mockCreateUserRepository.createUser).toHaveBeenCalledWith(
      Makeparams({
        password: "hashed_password",
      })
    )
    expect(mockGetUserByEmailRepository.getUserByEmail).toHaveBeenCalledWith(
      Makeparams().email
    )
    expect(mockHashGenerate.hash).toHaveBeenCalledWith(Makeparams().password)
    expect(mockHashGenerate.hash).toHaveBeenCalledTimes(1)
    expect(mockCreateUserRepository.createUser).toHaveBeenCalledTimes(1)
  })

  it("should throw UserAlreadyExistsError if user already exists", async () => {
    const { sut, mockGetUserByEmailRepository, mockCreateUserRepository } =
      makeSut()

    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue({
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "any_password",
      createdAt: new Date("2028-01-01"),
    })

    const promise = sut.createUser({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    })

    await expect(promise).rejects.toThrow(UserAlreadyExistsError)
    expect(mockCreateUserRepository.createUser).not.toHaveBeenCalled()
  })
  it("should throw if hash generator throws", async () => {
    const { sut, mockHashGenerate, mockGetUserByEmailRepository } = makeSut()

    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue(null)

    mockHashGenerate.hash.mockRejectedValue(new Error("hash error"))

    await expect(
      sut.createUser({
        name: "any_name",
        email: "any_email",
        password: "any_password",
      })
    ).rejects.toThrow()
  })

  it("should throw if hash generator throws", async () => {
    const { sut, mockHashGenerate, mockGetUserByEmailRepository } = makeSut()

    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue(null)

    mockHashGenerate.hash.mockRejectedValue(new Error("hash error"))

    await expect(
      sut.createUser({
        name: "any_name",
        email: "any_email",
        password: "any_password",
      })
    ).rejects.toThrow()
  })
})
