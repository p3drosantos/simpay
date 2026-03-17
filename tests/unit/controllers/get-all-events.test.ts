import { GetAllEventsController } from "../../../src/controllers/events/get-all-events.js"

const makeSut = () => {
  const mockUseCase = {
    getAllEvents: jest.fn(),
  }

  const sut = new GetAllEventsController(mockUseCase)
  return {
    sut,
    mockUseCase,
  }
}

const date = new Date(new Date().setDate(new Date().getDate() + 1))

describe("Get All Events Controller", () => {
  it("Should return 200 on success", async () => {
    const { sut, mockUseCase } = makeSut()
    const makeResponse = {
      id: "any_id",
      ownerId: "any_owner_id",
      name: "any_name",
      maxTickets: 10,
      ticketPriceInCents: 1000,
      longitude: 20,
      latitude: 20,
      date: date,
    }

    mockUseCase.getAllEvents.mockResolvedValue(makeResponse)

    const response = await sut.getAllEvents()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(makeResponse)
  })

  it("should return 500 if an unexpected error occurs", async () => {
    const { mockUseCase, sut } = makeSut()

    mockUseCase.getAllEvents.mockRejectedValue(new Error())

    const response = await sut.getAllEvents()

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "An error occurred while fetching events.",
    })
  })
})
