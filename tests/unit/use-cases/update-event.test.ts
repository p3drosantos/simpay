import { UpdateEventUseCase } from "../../../src/use-cases/events/update-event"
import { EventNotFoundError } from "../../../src/errors/users/event"
import { UnauthorizedError } from "../../../src/errors/users/user-errors"

const makeSut = () => {
  const mockUpdateEventRepository = {
    updateEvent: jest.fn(),
  }

  const mockGetEventByIdRepository = {
    getEventById: jest.fn(),
  }

  const sut = new UpdateEventUseCase(
    mockUpdateEventRepository,
    mockGetEventByIdRepository
  )

  return {
    sut,
    mockUpdateEventRepository,
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

const updateData = {
  name: "Novo nome",
}

describe("UpdateEventUseCase", () => {
  it("should update event successfully", async () => {
    const { sut, mockUpdateEventRepository, mockGetEventByIdRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(mockEvent)

    mockUpdateEventRepository.updateEvent.mockResolvedValue({
      ...mockEvent,
      ...updateData,
    })

    const result = await sut.updateEvent("event-id", "user-id", updateData)

    expect(result).toEqual({
      ...mockEvent,
      ...updateData,
    })

    expect(mockGetEventByIdRepository.getEventById).toHaveBeenCalledWith(
      "event-id"
    )

    expect(mockUpdateEventRepository.updateEvent).toHaveBeenCalledWith(
      "event-id",
      updateData
    )
  })

  it("should throw EventNotFoundError if event does not exist", async () => {
    const { sut, mockGetEventByIdRepository } = makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(null)

    await expect(
      sut.updateEvent("event-id", "user-id", updateData)
    ).rejects.toThrow(EventNotFoundError)
  })

  it("should throw UnauthorizedError if user is not owner", async () => {
    const { sut, mockGetEventByIdRepository } = makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue({
      ...mockEvent,
      ownerId: "another-user",
    })

    await expect(
      sut.updateEvent("event-id", "user-id", updateData)
    ).rejects.toThrow(UnauthorizedError)
  })

  it("should not call updateEvent if event does not exist", async () => {
    const { sut, mockGetEventByIdRepository, mockUpdateEventRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(null)

    await expect(
      sut.updateEvent("event-id", "user-id", updateData)
    ).rejects.toThrow()

    expect(mockUpdateEventRepository.updateEvent).not.toHaveBeenCalled()
  })

  it("should not call updateEvent if user is not owner", async () => {
    const { sut, mockGetEventByIdRepository, mockUpdateEventRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue({
      ...mockEvent,
      ownerId: "another-user",
    })

    await expect(
      sut.updateEvent("event-id", "user-id", updateData)
    ).rejects.toThrow()

    expect(mockUpdateEventRepository.updateEvent).not.toHaveBeenCalled()
  })

  it("should throw if updateEventRepository throws", async () => {
    const { sut, mockGetEventByIdRepository, mockUpdateEventRepository } =
      makeSut()

    mockGetEventByIdRepository.getEventById.mockResolvedValue(mockEvent)

    mockUpdateEventRepository.updateEvent.mockRejectedValue(
      new Error("db error")
    )

    await expect(
      sut.updateEvent("event-id", "user-id", updateData)
    ).rejects.toThrow("db error")
  })
})
