import {
  EventAlreadyExistsError,
  EventDateIsInThePastError,
} from "../../../src/errors/users/event"
import { UserNotFoundError } from "../../../src/errors/users/user-errors"
import { CreateEventUseCase } from "../../../src/use-cases/events/create-event"

const makeSut = () => {
  const mockCreateEventsRepository = {
    createEvent: jest.fn(),
  }

  const mockGetUserByIdRepository = {
    getUserById: jest.fn(),
  }

  const mockGetEventByLocationAndDateRepository = {
    getEventByLocationAndDate: jest.fn(),
  }

  const sut = new CreateEventUseCase(
    mockCreateEventsRepository,

    mockGetUserByIdRepository,
    mockGetEventByLocationAndDateRepository
  )
  return {
    sut,
    mockCreateEventsRepository,
    mockGetUserByIdRepository,
    mockGetEventByLocationAndDateRepository,
  }
}

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() + 1)

const params = {
  name: "Evento teste",
  ticketPriceInCents: 1000,
  maxTickets: 10,
  latitude: 10,
  longitude: 10,
  date: futureDate,
  ownerId: "user-id",
}

describe("CreateEventUseCase", () => {
  it("should create event successfully", async () => {
    const {
      sut,
      mockGetUserByIdRepository,
      mockCreateEventsRepository,
      mockGetEventByLocationAndDateRepository,
    } = makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue({
      id: "user-id",
    })

    mockGetEventByLocationAndDateRepository.getEventByLocationAndDate.mockResolvedValue(
      null
    )

    mockCreateEventsRepository.createEvent.mockResolvedValue({
      id: "event-id",
      ...params,
    })

    const result = await sut.createEvent(params)

    expect(result.id).toBe("event-id")

    expect(
      mockGetEventByLocationAndDateRepository.getEventByLocationAndDate
    ).toHaveBeenCalledWith(params.latitude, params.longitude, params.date)

    expect(mockCreateEventsRepository.createEvent).toHaveBeenCalledWith(params)
  })

  it("should throw error if date is in the past", async () => {
    const { sut, mockGetUserByIdRepository, mockCreateEventsRepository } =
      makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue({ id: "user-id" })

    const promise = sut.createEvent({
      ...params,
      date: new Date(Date.now() - 1000),
    })

    await expect(promise).rejects.toBeInstanceOf(EventDateIsInThePastError)

    expect(mockCreateEventsRepository.createEvent).not.toHaveBeenCalled()
  })

  it("should throw error if user not found", async () => {
    const { sut, mockGetUserByIdRepository, mockCreateEventsRepository } =
      makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue(null)

    const promise = sut.createEvent(params)

    await expect(promise).rejects.toBeInstanceOf(UserNotFoundError)

    expect(mockCreateEventsRepository.createEvent).not.toHaveBeenCalled()
  })

  it("should throw error if event already exists", async () => {
    const {
      sut,
      mockGetEventByLocationAndDateRepository,
      mockGetUserByIdRepository,
      mockCreateEventsRepository,
    } = makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue({
      id: "user-id",
    })

    mockGetEventByLocationAndDateRepository.getEventByLocationAndDate.mockResolvedValue(
      {
        id: "event-id",
        ...params,
      }
    )

    const promise = sut.createEvent(params)

    await expect(promise).rejects.toThrow(EventAlreadyExistsError)
    expect(mockCreateEventsRepository.createEvent).not.toHaveBeenCalled()
  })
})
