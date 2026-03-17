import { GetEventByIdUseCase } from "../../../src/use-cases/events/get-event-by-id"

const makeSut = () => {
  const mockGetEventByIdRepository = {
    getEventById: jest.fn(),
  }

  const sut = new GetEventByIdUseCase(mockGetEventByIdRepository)

  return {
    sut,
    mockGetEventByIdRepository,
  }
}

const mockEvent = {
  id: "event-id",
  ownerId: "user-id",
  name: "Evento teste",
  maxTickets: 10,
  ticketPriceInCents: 1000,
  longitude: 10,
  latitude: 10,
  date: new Date(),
}

describe("GetEventByIdUseCase", () => {
  it("should return event by id", async () => {
    const { sut, mockGetEventByIdRepository } = makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(mockEvent)

    const result = await sut.getEventById("event-id")

    expect(result).toEqual(mockEvent)

    expect(mockGetEventByIdRepository.getEventById).toHaveBeenCalledWith(
      "event-id"
    )
  })
  it("should return null if event does not exist", async () => {
    const { sut, mockGetEventByIdRepository } = makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(null)

    const result = await sut.getEventById("event-id")

    expect(result).toBeNull()
  })

  it("should throw if repository throws", async () => {
    const { sut, mockGetEventByIdRepository } = makeSut()

    mockGetEventByIdRepository.getEventById.mockRejectedValue(
      new Error("db error")
    )

    await expect(sut.getEventById("event-id")).rejects.toThrow("db error")
  })
})
