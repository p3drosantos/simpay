import { BuyTicketUseCase } from "../../../src/use-cases/ticket/buy-ticket"
import { UserNotFoundError } from "../../../src/errors/users/user-errors"
import {
  EventAlreadyOccurredError,
  EventCapacityExceededError,
  OnlyCustomerCanBuyTicketError,
} from "../../../src/errors/users/ticket"
import { EventNotFoundError } from "../../../src/errors/users/event"

import { stripe } from "../../../src/lib/stripe"

jest.mock("../../../src/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}))

const makeSut = () => {
  const mockBuyTicketRepository = {
    buyTicket: jest.fn(),
    sumTicketsByEventId: jest.fn(),
    updateTicket: jest.fn(),
  }

  const mockGetEventByIdRepository = {
    getEventById: jest.fn(),
  }

  const mockGetUserByIdRepository = {
    getUserById: jest.fn(),
  }

  const sut = new BuyTicketUseCase(
    mockBuyTicketRepository,
    mockGetEventByIdRepository,
    mockGetUserByIdRepository
  )

  return {
    sut,
    mockBuyTicketRepository,
    mockGetEventByIdRepository,
    mockGetUserByIdRepository,
  }
}

const params = {
  eventId: "event-id",
  buyerId: "buyer-id",
  quantity: 10,
}

describe("BuyTicketUseCase", () => {
  it("should buy ticket successfully", async () => {
    const {
      sut,
      mockBuyTicketRepository,
      mockGetUserByIdRepository,
      mockGetEventByIdRepository,
    } = makeSut()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const eventMock = {
      id: "event-id",
      date: futureDate,
      maxTickets: 100,
      ticketPriceInCents: 100,
      name: "event-name",
    }

    const userMock = {
      id: "buyer-id",
      role: "customer",
    }

    mockGetUserByIdRepository.getUserById.mockResolvedValue(userMock)

    mockGetEventByIdRepository.getEventById.mockResolvedValue(eventMock)

    mockBuyTicketRepository.sumTicketsByEventId.mockResolvedValue(0)

    const expectedTotalPrice = params.quantity * eventMock.ticketPriceInCents

    mockBuyTicketRepository.buyTicket.mockResolvedValue({
      id: "ticket-id",
      eventId: params.eventId,
      buyerId: params.buyerId,
      quantity: params.quantity,
      totalPriceInCents: expectedTotalPrice,
      status: "pending",
      createdAt: new Date(),
    })
    ;(stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      id: "session-id",
      url: "checkout-url",
    })

    const result = await sut.buyTicket(params)

    expect(result).toEqual({
      checkoutUrl: "checkout-url",
      ticketId: "ticket-id",
    })
  })

  it("should throw error if user not found", async () => {
    const { sut, mockGetUserByIdRepository, mockBuyTicketRepository } =
      makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue(null)

    const promise = sut.buyTicket(params)

    await expect(promise).rejects.toBeInstanceOf(UserNotFoundError)

    expect(mockBuyTicketRepository.buyTicket).not.toHaveBeenCalled()
  })
  it("should throw error if user is not customer", async () => {
    const { sut, mockGetUserByIdRepository, mockBuyTicketRepository } =
      makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue({
      id: "user-id",
      role: "admin",
    })

    const promise = sut.buyTicket(params)

    await expect(promise).rejects.toBeInstanceOf(OnlyCustomerCanBuyTicketError)

    expect(mockBuyTicketRepository.buyTicket).not.toHaveBeenCalled()
  })

  it("should throw error if event does not exist", async () => {
    const {
      sut,
      mockGetUserByIdRepository,
      mockGetEventByIdRepository,
      mockBuyTicketRepository,
    } = makeSut()

    mockGetUserByIdRepository.getUserById.mockResolvedValue({
      id: "user-id",
      role: "customer",
    })

    mockGetEventByIdRepository.getEventById.mockResolvedValue(null)

    const promise = sut.buyTicket(params)

    await expect(promise).rejects.toBeInstanceOf(EventNotFoundError)

    expect(mockBuyTicketRepository.buyTicket).not.toHaveBeenCalled()
  })

  it("should throw error if event is in the past", async () => {
    const {
      sut,
      mockGetUserByIdRepository,
      mockGetEventByIdRepository,
      mockBuyTicketRepository,
    } = makeSut()

    const pastDate = new Date()

    pastDate.setDate(pastDate.getDate() - 1)

    const eventMock = {
      id: "event-id",
      date: pastDate,
      maxTickets: 100,
      ticketPriceInCents: 100,
    }

    mockGetUserByIdRepository.getUserById.mockResolvedValue({
      id: "user-id",
      role: "customer",
    })

    mockGetEventByIdRepository.getEventById.mockResolvedValue(eventMock)

    const promise = sut.buyTicket(params)

    await expect(promise).rejects.toBeInstanceOf(EventAlreadyOccurredError)

    expect(mockBuyTicketRepository.buyTicket).not.toHaveBeenCalled()
  })

  it("should throw error if event is full", async () => {
    const {
      sut,
      mockGetUserByIdRepository,
      mockGetEventByIdRepository,
      mockBuyTicketRepository,
    } = makeSut()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const eventMock = {
      id: "event-id",
      date: futureDate,
      maxTickets: 10,
      ticketPriceInCents: 100,
    }

    mockGetUserByIdRepository.getUserById.mockResolvedValue({
      id: "user-id",
      role: "customer",
    })

    mockGetEventByIdRepository.getEventById.mockResolvedValue(eventMock)

    mockBuyTicketRepository.sumTicketsByEventId.mockResolvedValue(10)

    const promise = sut.buyTicket(params)

    await expect(promise).rejects.toBeInstanceOf(EventCapacityExceededError)

    expect(mockBuyTicketRepository.buyTicket).not.toHaveBeenCalled()
  })
})
