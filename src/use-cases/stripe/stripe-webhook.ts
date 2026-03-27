import Stripe from "stripe"
import { IStripeWebhookUseCase } from "../../controllers/stripe/protocols.js"
import { IBuyTicketRepository } from "../../controllers/tickets/protocols.js"
import { InvalidWebhookEventError } from "../../errors/users/webhook.js"
import { MissingTicketIdError } from "../../errors/users/ticket.js"

export class StripeWebhookUseCase implements IStripeWebhookUseCase {
  constructor(private readonly buyTicketRepository: IBuyTicketRepository) {}

  async updateFromWebhook(event: Stripe.Event): Promise<{ ticketId: string }> {
    if (event.type !== "checkout.session.completed") {
      throw new InvalidWebhookEventError(event.type)
    }

    const session = event.data.object as Stripe.Checkout.Session

    const ticketId = session.metadata?.ticketId
    if (!ticketId) {
      throw new MissingTicketIdError()
    }

    await this.buyTicketRepository.updateTicket(ticketId, {
      status: "paid",
    })

    return { ticketId }
  }
}
