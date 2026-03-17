import { UpdateEventController } from "../../../src/controllers/events/update-event"
import { UnauthorizedError } from "../../../src/errors/users/user-errors"

const makeSut = () => {
  const mockUseCase = {
    updateEvent: jest.fn(),
  }

  const sut = new UpdateEventController(mockUseCase)
  return {
    sut,
    mockUseCase,
  }
}

const makeRequest = (overrides = {}) => {
  return {
    params: { id: crypto.randomUUID() },
    userId: "e4d5c8b7-4a4e-4c8b-9a4e-4c8b9a4e4c8b",
    body: {
      name: "Pedro Santos Aniversario",
      ticketPriceInCents: 1000,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
    ...overrides,
  }
}

describe("Update Event Controller", () => {
  it("Should return 200 on success", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()
    const makeResponse = {
      id: "any_id",
      ownerId: "any_owner_id",
      name: "any_name",
      maxTickets: 10,
      ticketPriceInCents: 1000,
      longitude: 20,
      latitude: 20,
      date: new Date(),
    }

    mockUseCase.updateEvent.mockResolvedValue(makeResponse)

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(makeResponse)
  })

  it("should return 400 if params.id is missing", async () => {
    const { sut } = makeSut()
    const request = makeRequest({ params: {} })

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: "Event ID is required" })
  })

  it("should return 400 if body is missing", async () => {
    const { sut } = makeSut()
    const request = makeRequest({ body: {} })

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: "No fields to update" })
  })

  it("should return 400 if invalid fields are provided", async () => {
    const { sut } = makeSut()
    const request = makeRequest({ body: { age: 10 } })

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error:
        "Invalid fields: age. Allowed fields are: name, ticketPriceInCents, date",
    })
  })

  it("should return 401 if user is not authenticated", async () => {
    const { sut } = makeSut()
    const request = makeRequest({ userId: null })

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ error: "Unauthorized" })
  })

  it("should return 404 if event is not found", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    mockUseCase.updateEvent.mockResolvedValue(null)

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(404)
  })

  it("should return 401 if user is not the owner of the event", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    mockUseCase.updateEvent.mockRejectedValue(new UnauthorizedError())

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ error: "Unauthorized" })
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { mockUseCase, sut } = makeSut()
    const request = makeRequest()

    mockUseCase.updateEvent.mockRejectedValue(new Error())

    const response = await sut.updateEvent(request)

    expect(response.statusCode).toBe(500)
  })
})
