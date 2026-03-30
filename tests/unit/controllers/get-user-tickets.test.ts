import { GetUserTicketsController } from "../../../src/controllers/tickets/get-user-tickets.js"

const makeSut = () => {
  const mockUseCase = {
    getUserTickets: jest.fn(),
  }

  const sut = new GetUserTicketsController(mockUseCase)

  return {
    sut,
    mockUseCase,
  }
}

const makeRequest = (overrides = {}) => {
  return {
    userId: crypto.randomUUID(),
    ...overrides,
  }
}

describe("Get User Tickets Controller", () => {
  it("Should return 200 on success", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    const makeResponse = [
      {
        id: "any_id",
        quantity: 2,
        totalPriceInCents: 1000,
        status: "paid",
        createdAt: new Date(),
        event: {
          id: "any_id",
          name: "any_name",
          date: new Date(),
        },
      },
    ]

    mockUseCase.getUserTickets.mockResolvedValue(makeResponse)

    const result = await sut.getUserTickets(request)

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual(makeResponse)
  })

  it("Should return 401 if userId is not provided ", async () => {
    const { sut } = makeSut()
    const request = makeRequest({ userId: undefined })

    const result = await sut.getUserTickets(request)

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({ error: "Unauthorized" })
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    mockUseCase.getUserTickets.mockRejectedValue(new Error())

    const result = await sut.getUserTickets(request)
    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual({ error: "Internal server error" })
  })
})
