import { BuyTicketController } from "../../../src/controllers/tickets/buy-ticket.js"

import { UserNotFoundError } from "../../../src/errors/users/user-errors.js"
import { EventNotFoundError } from "../../../src/errors/users/event.js"
import {
  EventAlreadyOccurredError,
  EventCapacityExceededError,
  OnlyCustomerCanBuyTicketError,
} from "../../../src/errors/users/ticket.js"

const makeSut = () => {
  const mockUseCase = {
    buyTicket: jest.fn(),
  }

  const sut = new BuyTicketController(mockUseCase)
  return {
    sut,
    mockUseCase,
  }
}

const eventid = "e4d5c8b7-4a4e-4c8b-9a4e-4c8b9a4e4c8b"

const makeRequest = (overrides = {}) => {
  return {
    params: { eventId: eventid },
    userId: "e4d5c8b7-4a4e-4c8b-9a4e-4c8b9a4e4c8b",
    body: {
      quantity: 1,
    },
    ...overrides,
  }
}

describe("Buy Ticket Controller", () => {
  it("Should return 200 on success", async () => {
    const { sut, mockUseCase } = makeSut()

    const makeResponse = {
      checkoutUrl: "https://stripe.com/checkout/session/123",
      ticketId: "ticket-123",
    }

    mockUseCase.buyTicket.mockResolvedValue(makeResponse)

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(makeResponse)
  })

  it("should call use case with correct params", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockResolvedValue({
      checkoutUrl: "url",
      ticketId: "id",
    })

    const request = makeRequest()

    await sut.buyTicket(request)

    expect(mockUseCase.buyTicket).toHaveBeenCalledWith({
      quantity: 1,
      eventId: eventid,
      buyerId: request.userId,
    })
  })

  it("should return 400 if missing body", async () => {
    const { sut, mockUseCase } = makeSut()

    const response = await sut.buyTicket(makeRequest({ body: undefined }))

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: "Missing body" })

    expect(mockUseCase.buyTicket).not.toHaveBeenCalled()
  })

  it("should return 401 if userId is missing", async () => {
    const { sut, mockUseCase } = makeSut()

    const response = await sut.buyTicket(makeRequest({ userId: undefined }))

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ error: "Unauthorized: Missing user ID" })

    expect(mockUseCase.buyTicket).not.toHaveBeenCalled()
  })

  it("should return 400 if eventId is missing", async () => {
    const { sut, mockUseCase } = makeSut()

    const response = await sut.buyTicket(
      makeRequest({ params: { eventId: undefined } })
    )

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: "Missing event ID" })

    expect(mockUseCase.buyTicket).not.toHaveBeenCalled()
  })

  it("should return 404 if user not found", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue(new UserNotFoundError())

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      error: "User not found",
    })
  })

  it("should return 403 if user is not customer", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue(new OnlyCustomerCanBuyTicketError())

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual({
      error: "Only customers can buy tickets",
    })
  })

  it("should return 400 if event already occurred", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue(new EventAlreadyOccurredError())

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: "Event already occurred",
    })
  })

  it("should return 404 if event not found", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue(new EventNotFoundError())

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      error: "Event not found",
    })
  })

  it("should return 400 if event capacity exceeded", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue(new EventCapacityExceededError())

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: "Event capacity exceeded",
    })
  })
  it("should return 400 if validation fails", async () => {
    const { sut } = makeSut()

    const response = await sut.buyTicket(
      makeRequest({
        body: {
          quantity: -1,
        },
      })
    )

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: [
        {
          field: "quantity",
          message: "Quantity must be a positive number",
        },

        {
          field: "quantity",
          message: "Quantity must be at least 1",
        },
      ],
    })
  })

  it("should return 500 with error message", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue(new Error("something broke"))

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "something broke",
    })
  })

  it("should return 500 internal error fallback", async () => {
    const { sut, mockUseCase } = makeSut()

    mockUseCase.buyTicket.mockRejectedValue("weird")

    const response = await sut.buyTicket(makeRequest())

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "Internal server error",
    })
  })
})
