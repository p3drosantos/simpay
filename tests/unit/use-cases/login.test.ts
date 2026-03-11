import { LoginUseCase } from "../../../src/use-cases/auth/login.js"

const makeSut = () => {
  const mockGetUserByEmailRepository = {
    getUserByEmail: jest.fn(),
  }

  const mockHashCompare = {
    compare: jest.fn(),
  }

  const mockTokenGenerator = {
    generate: jest.fn(),
  }

  const sut = new LoginUseCase(
    mockGetUserByEmailRepository,
    mockHashCompare,
    mockTokenGenerator
  )

  return {
    sut,
    mockGetUserByEmailRepository,
    mockHashCompare,
    mockTokenGenerator,
  }
}

describe("LoginUseCase", () => {
  it("should login successfully", async () => {
    const {
      mockGetUserByEmailRepository,
      mockHashCompare,
      mockTokenGenerator,
      sut,
    } = makeSut()

    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue({
      id: "1",
      name: "Pedro",
      email: "pedro@email.com",
      password: "hashed_password",
      createdAt: new Date("2028-01-01T00:00:00.000Z"),
    })

    mockHashCompare.compare.mockResolvedValue(true)

    mockTokenGenerator.generate.mockReturnValue("token567")

    const response = await sut.login({
      email: "pedro@email.com",
      password: "password",
    })

    expect(response).toEqual({
      token: "token567",
      user: {
        id: "1",
        name: "Pedro",
        email: "pedro@email.com",
        createdAt: new Date("2028-01-01T00:00:00.000Z"),
      },
    })
    expect(mockGetUserByEmailRepository.getUserByEmail).toHaveBeenCalledWith(
      "pedro@email.com"
    )
    expect(mockHashCompare.compare).toHaveBeenCalledWith(
      "password",
      "hashed_password"
    )
    expect(mockHashCompare.compare).toHaveBeenCalledTimes(1)
    expect(mockTokenGenerator.generate).toHaveBeenCalledWith({ userId: "1" })
    expect(mockTokenGenerator.generate).toHaveBeenCalledTimes(1)
  })

  it("should throw an error if user not found", async () => {
    const { sut, mockGetUserByEmailRepository, mockHashCompare } = makeSut()
    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue(null)
    await expect(
      sut.login({
        email: "pedro@email.com",
        password: "password",
      })
    ).rejects.toThrow("User not found")

    expect(mockHashCompare.compare).not.toHaveBeenCalled()
  })

  it("should throw an error if password is invalid", async () => {
    const {
      sut,
      mockGetUserByEmailRepository,
      mockHashCompare,
      mockTokenGenerator,
    } = makeSut()
    mockGetUserByEmailRepository.getUserByEmail.mockResolvedValue({
      id: "1",
      name: "Pedro",
      email: "pedro@email.com",
      password: "hashed_password",
      createdAt: new Date("2028-01-01T00:00:00.000Z"),
    })
    mockHashCompare.compare.mockResolvedValue(false)
    await expect(
      sut.login({
        email: "pedro@email.com",
        password: "password",
      })
    ).rejects.toThrow("Invalid credentials")

    expect(mockTokenGenerator.generate).not.toHaveBeenCalled()
  })
})
