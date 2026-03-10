import { DeleteEventController } from "../../../src/controllers/events/delete-event"

const makeSut = () => {
  const mockUseCase = {
    deleteEvent: jest.fn(),
  }

  const sut = new DeleteEventController(mockUseCase)
  return {
    sut,
    mockUseCase,
  }
}

const eventid = crypto.randomUUID()
const date = new Date(new Date().setDate(new Date().getDate() + 1))

const makeRequest = (overrides = {}) => {
  return {
    params: { id: eventid },
    userId: "e4d5c8b7-4a4e-4c8b-9a4e-4c8b9a4e4c8b",
    ...overrides,
  }
}

describe("DeleteEventController", () => {
  it("should delete an event", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    const deletedEventMock = {
      id: "1",
      title: "Futebol",
      description: "Partida de futebol",
      date: date,
      createdAt: new Date(),
    }

    mockUseCase.deleteEvent.mockResolvedValue(deletedEventMock)

    const response = await sut.deleteEvent(request)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(deletedEventMock)
    expect(mockUseCase.deleteEvent).toHaveBeenCalledWith(
      eventid,
      request.userId
    )
    expect(mockUseCase.deleteEvent).toHaveBeenCalledTimes(1)
  })

  it("should return 400 if params.id is missing", async () => {
    const { sut } = makeSut()

    const requestWithoutId = {
      userId: "e4d5c8b7-4a4e-4c8b-9a4e-4c8b9a4e4c8b",
    } as unknown as {
      params: { id: string }
    }

    const response = await sut.deleteEvent(requestWithoutId)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: "Missing event ID in request parameters",
    })
  })

  it("should return 400 if params.id is invalid", async () => {
    const { sut } = makeSut()
    const request = makeRequest({
      params: { id: "invalid-id" },
      userId: "e4d5c8b7-4a4e-4c8b-9a4e-4c8b9a4e4c8b",
    })

    const response = await sut.deleteEvent(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: [
        {
          field: "id",
          message: "Invalid event ID",
        },
      ],
    })
  })

  it("should return 401 if userId is missing", async () => {
    const { sut } = makeSut()
    const request = makeRequest({
      userId: undefined,
    })

    const response = await sut.deleteEvent(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      error: "Unauthorized: Missing user ID",
    })
  })

  it("should return 404 if event is not found", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    mockUseCase.deleteEvent.mockResolvedValue(null)

    const response = await sut.deleteEvent(request)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      error: "Event not found",
    })
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { sut, mockUseCase } = makeSut()
    const request = makeRequest()

    mockUseCase.deleteEvent.mockRejectedValue(new Error())

    const response = await sut.deleteEvent(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "Internal server error",
    })
  })
})
