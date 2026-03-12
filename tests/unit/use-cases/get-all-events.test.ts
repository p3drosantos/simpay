import { GetAllEventsUseCase } from "../../../src/use-cases/events/get-all-events"

const makeSut = () => {
  const mockGetAllEventsRepository = {
    getAllEvents: jest.fn(),
  }

  const sut = new GetAllEventsUseCase(mockGetAllEventsRepository)
  return {
    sut,
    mockGetAllEventsRepository,
  }
}

describe("GetAllEventsUseCase", () => {
  it("should return events", async () => {
    const { sut, mockGetAllEventsRepository } = makeSut()

    const events = [{ id: "1" }, { id: "2" }]

    mockGetAllEventsRepository.getAllEvents.mockResolvedValue(events)

    const result = await sut.getAllEvents()

    expect(result).toEqual(events)
  })

  it("should call getAllEventsRepository", async () => {
    const { sut, mockGetAllEventsRepository } = makeSut()

    mockGetAllEventsRepository.getAllEvents.mockResolvedValue([])

    await sut.getAllEvents()
    expect(mockGetAllEventsRepository.getAllEvents).toHaveBeenCalled()
  })

  it("should throw if repository throws", async () => {
    const mockRepository = {
      getAllEvents: jest.fn(),
    }

    const sut = new GetAllEventsUseCase(mockRepository)

    mockRepository.getAllEvents.mockRejectedValue(new Error())

    await expect(sut.getAllEvents()).rejects.toThrow()
  })
})
