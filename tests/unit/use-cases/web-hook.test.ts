import { StripeWebhookUseCase } from "../../../src/use-cases/stripe/stripe-webhook"
import { InvalidWebhookEventError } from "../../../src/errors/users/webhook"
import { MissingTicketIdError } from "../../../src/errors/users/ticket"

import { IBuyTicketRepository } from "../../../src/controllers/tickets/protocols"
import Stripe from "stripe"

const makeSut = () => {
  const mockRepository = {
    updateTicket: jest.fn(),
    buyTicket: jest.fn(),
    sumTicketsByEventId: jest.fn(),
  } satisfies IBuyTicketRepository

  const mockQueue = {
    sendMessage: jest.fn(),
  }

  const sut = new StripeWebhookUseCase(mockRepository, mockQueue)

  return { sut, mockRepository, mockQueue }
}

describe("StripeWebhookUseCase", () => {
  it("should update ticket when event is valid", async () => {
    const { sut, mockRepository, mockQueue } = makeSut()
    mockRepository.updateTicket.mockResolvedValue({
      id: "ticket-123",
      eventId: "event-123",
      buyerId: "user-123",
    })

    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {
            ticketId: "ticket-123",
          },
        },
      },
    } as unknown as Stripe.Event

    const result = await sut.updateFromWebhook(event)

    expect(mockRepository.updateTicket).toHaveBeenCalledWith("ticket-123", {
      status: "paid",
    })

    expect(result).toEqual({
      ticketId: "ticket-123",
    })

    expect(mockQueue.sendMessage).toHaveBeenCalledWith({
      type: "PAYMENT_CONFIRMED",
      ticketId: "ticket-123",
      eventId: expect.any(String),
      buyerId: expect.any(String),
    })
  })

  it("should throw if event type is invalid", async () => {
    const { sut, mockRepository } = makeSut()

    const event = {
      type: "payment.failed",
    } as unknown as Stripe.Event

    const promise = sut.updateFromWebhook(event)

    await expect(promise).rejects.toBeInstanceOf(InvalidWebhookEventError)

    expect(mockRepository.updateTicket).not.toHaveBeenCalled()
  })

  it("should throw if ticketId is missing", async () => {
    const { sut, mockRepository } = makeSut()

    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {},
        },
      },
    } as unknown as Stripe.Event

    const promise = sut.updateFromWebhook(event)

    await expect(promise).rejects.toBeInstanceOf(MissingTicketIdError)

    expect(mockRepository.updateTicket).not.toHaveBeenCalled()
  })

  it("should propagate repository error", async () => {
    const { sut, mockRepository } = makeSut()

    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {
            ticketId: "ticket-123",
          },
        },
      },
    } as unknown as Stripe.Event

    mockRepository.updateTicket.mockRejectedValue(new Error("db error"))

    const promise = sut.updateFromWebhook(event)

    await expect(promise).rejects.toThrow("db error")
  })

  it("should send message to queue when ticket is paid", async () => {
    const { sut, mockRepository, mockQueue } = makeSut()

    mockRepository.updateTicket.mockResolvedValue({
      id: "ticket-123",
      eventId: "event-123",
      buyerId: "user-123",
    })

    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {
            ticketId: "ticket-123",
          },
        },
      },
    } as unknown as Stripe.Event

    await sut.updateFromWebhook(event)

    expect(mockQueue.sendMessage).toHaveBeenCalledWith({
      type: "PAYMENT_CONFIRMED",
      ticketId: "ticket-123",
      eventId: "event-123",
      buyerId: "user-123",
    })
  })
})
