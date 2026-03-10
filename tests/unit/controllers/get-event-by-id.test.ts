import { GetEventByIdController } from "../../../src/controllers/events/get-event-by-id"

const makeSut = () => {
  const mockUseCase = {
    getEventById: jest.fn(),
  }

  const sut = new GetEventByIdController(mockUseCase)
  return {
    sut,
    mockUseCase,
  }
}

const makeRequest = (overrides = {}) => {
  return {
    params: { id: crypto.randomUUID() },
    ...overrides,
  }
}

describe("GetEventById", () => {
  it("should return 200 on success ", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()
    const makeResponse = {
      id: "any_id",
      ownerId: "any_owner_id",
      name: "any_name",
      ticketPriceInCents: 1000,
      longitude: 20,
      latitude: 20,
      date: new Date(),
    }

    mockUseCase.getEventById.mockResolvedValue(makeResponse)

    const response = await sut.getEventById(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(makeResponse)
  })

  it("should return 400 if params.id is invalid", async () => {
    const { sut } = makeSut()
    const request = makeRequest({
      params: { id: "invalid_id" },
    })

    const response = await sut.getEventById(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: "Invalid event ID" })
  })

  it("should return 404 if event is not found", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    mockUseCase.getEventById.mockResolvedValue(null)

    const response = await sut.getEventById(request)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ error: "Event not found" })
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { mockUseCase, sut } = makeSut()
    const request = makeRequest()

    mockUseCase.getEventById.mockRejectedValue(new Error())

    const response = await sut.getEventById(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({ error: "Internal server error" })
  })
})
