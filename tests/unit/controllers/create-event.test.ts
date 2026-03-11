import { CreateEventController } from "../../../src/controllers/events/create-event.js"

const makeSut = () => {
  const mockUseCase = {
    createEvent: jest.fn(),
  }

  const sut = new CreateEventController(mockUseCase)

  return {
    sut,
    mockUseCase,
  }
}

const date = new Date(new Date().setDate(new Date().getDate() + 1))

const makeRequest = (overrides = {}) => ({
  body: {
    name: "Pedro Santos Aniversario",
    ticketPriceInCents: 1000,
    longitude: 20,
    latitude: 20,
    date: date,
    ...overrides,
  },
})

describe("CreateEventController", () => {
  it("Should return 201 on create event", async () => {
    const { sut, mockUseCase } = makeSut()

    const responseMock = {
      id: "user-id",
      ownerId: "owner-id",
      name: "Pedro Santos Aniversario",
      latitude: 20,
      longitude: 20,
      ticketPriceInCents: 1000,
      createdAt: date,
    }

    mockUseCase.createEvent.mockResolvedValue(responseMock)

    const request = {
      ...makeRequest(),
      userId: "owner-id",
    }

    const response = await sut.createEvent(request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(responseMock)
    expect(mockUseCase.createEvent).toHaveBeenCalledWith({
      ...request.body,
      ownerId: "owner-id",
    })
  })

  it("Should return 400 when missing body", async () => {
    const { sut } = makeSut()

    const response = await sut.createEvent({})

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: "Missing body",
    })
  })

  it("Should return 401 if user is not authenticated", async () => {
    const { sut, mockUseCase } = makeSut()

    const response = await sut.createEvent(makeRequest())

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ error: "Unauthorized: Missing user ID" })
    expect(mockUseCase.createEvent).not.toHaveBeenCalled()
  })

  it("should return 400 if anywhere params is invalid", async () => {
    const { sut } = makeSut()

    const request = makeRequest({
      ticketPriceInCents: -1,
      longitude: -200,
      latitude: -200,
    })

    const response = await sut.createEvent(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: [
        {
          field: "ticketPriceInCents",
          message: "Ticket price must be a positive number",
        },
        {
          field: "longitude",
          message: "Too small: expected number to be >=-180",
        },
        {
          field: "latitude",
          message: "Too small: expected number to be >=-90",
        },
      ],
    })
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.createEvent.mockRejectedValue(new Error())

    const request = {
      ...makeRequest(),
      userId: "owner-id",
    }

    const response = await sut.createEvent(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "Internal server error",
    })
  })
})
