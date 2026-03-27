import { IGetEventByIdRepository } from "../../controllers/events/protocols.js"
import {
  IBuyTicketRepository,
  IBuyTicketUseCase,
} from "../../controllers/tickets/protocols.js"
import { IGetUserByIdRepository } from "../../controllers/users/protocols.js"
import { EventNotFoundError } from "../../errors/users/event.js"
import {
  EventAlreadyOccurredError,
  EventCapacityExceededError,
  OnlyCustomerCanBuyTicketError,
} from "../../errors/users/ticket.js"
import { UserNotFoundError } from "../../errors/users/user-errors.js"
import { stripe } from "../../lib/stripe.js"
import { BuyTicketParams } from "../../types/ticket.js"

export class BuyTicketUseCase implements IBuyTicketUseCase {
  constructor(
    private readonly buyTicketRepository: IBuyTicketRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository
  ) {}
  async buyTicket(
    params: BuyTicketParams
  ): Promise<{ checkoutUrl: string; ticketId: string }> {
    const user = await this.getUserByIdRepository.getUserById(params.buyerId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.role !== "customer") {
      throw new OnlyCustomerCanBuyTicketError()
    }

    const event = await this.getEventByIdRepository.getEventById(params.eventId)

    if (!event) {
      throw new EventNotFoundError()
    }

    if (event.date < new Date()) {
      throw new EventAlreadyOccurredError()
    }

    const soldTickets = await this.buyTicketRepository.sumTicketsByEventId(
      params.eventId
    )

    if (soldTickets + params.quantity > event.maxTickets) {
      throw new EventCapacityExceededError()
    }

    const totalPriceInCents = params.quantity * event.ticketPriceInCents

    const ticket = await this.buyTicketRepository.buyTicket({
      eventId: params.eventId,
      buyerId: params.buyerId,
      quantity: params.quantity,
      totalPriceInCents,
      status: "pending",
    })

    if (!ticket) {
      throw new Error("Failed to buy ticket")
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: event.name },
            unit_amount: event.ticketPriceInCents,
          },
          quantity: params.quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        ticketId: ticket.id,
      },
    })

    if (!session.url) {
      throw new Error("Failed to create checkout session")
    }

    return {
      checkoutUrl: session.url,
      ticketId: ticket.id,
    }
  }
}
