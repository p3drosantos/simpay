import { DeleteEventUseCase } from "../../../src/use-cases/events/delete-event"

const makeSut = () => {
  const mockDeleteEventRepository = {
    deleteEvent: jest.fn(),
  }

  const mockGetEventByIdRepository = {
    getEventById: jest.fn(),
  }

  const sut = new DeleteEventUseCase(
    mockDeleteEventRepository,
    mockGetEventByIdRepository
  )

  return {
    sut,
    mockDeleteEventRepository,
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

describe("DeleteEventUseCase", () => {
  it("should delete an event successfully", async () => {
    const { sut, mockDeleteEventRepository, mockGetEventByIdRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(mockEvent)

    mockDeleteEventRepository.deleteEvent.mockResolvedValue(mockEvent)

    const response = await sut.deleteEvent("event-id", "user-id")

    expect(response).toEqual(mockEvent)
    expect(mockGetEventByIdRepository.getEventById).toHaveBeenCalledWith(
      "event-id"
    )
    expect(mockDeleteEventRepository.deleteEvent).toHaveBeenCalledWith(
      "event-id"
    )
  })
  it("should throw EventNotFoundError if event does not exist", async () => {
    const { sut, mockGetEventByIdRepository, mockDeleteEventRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(null)

    await expect(sut.deleteEvent("event-id", "user-id")).rejects.toThrow(
      "Event not found"
    )

    expect(mockDeleteEventRepository.deleteEvent).not.toHaveBeenCalled()
  })

  it("should throw UnauthorizedError if user is not the owner", async () => {
    const { sut, mockGetEventByIdRepository, mockDeleteEventRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue({
      ...mockEvent,
      ownerId: "another-user-id",
    })

    await expect(sut.deleteEvent("event-id", "user-id")).rejects.toThrow(
      "Unauthorized"
    )
    expect(mockDeleteEventRepository.deleteEvent).not.toHaveBeenCalled()
  })
})
