import Stripe from "stripe"
import { IStripeWebhookUseCase } from "../../controllers/stripe/protocols.js"
import { IBuyTicketRepository } from "../../controllers/tickets/protocols.js"
import { InvalidWebhookEventError } from "../../errors/users/webhook.js"
import { MissingTicketIdError } from "../../errors/users/ticket.js"
import { IQueue } from "../../interfaces/queue.js"

export class StripeWebhookUseCase implements IStripeWebhookUseCase {
  constructor(
    private readonly buyTicketRepository: IBuyTicketRepository,
    private readonly queue: IQueue
  ) {}

  async updateFromWebhook(event: Stripe.Event): Promise<{ ticketId: string }> {
    if (event.type !== "checkout.session.completed") {
      throw new InvalidWebhookEventError(event.type)
    }

    const session = event.data.object as Stripe.Checkout.Session

    const ticketId = session.metadata?.ticketId

    if (!ticketId) {
      throw new MissingTicketIdError()
    }

    const ticket = await this.buyTicketRepository.updateTicket(ticketId, {
      status: "paid",
    })
    console.log("vou enviar a mensagem para a fila")
    await this.queue.sendMessage({
      type: "PAYMENT_CONFIRMED",
      ticketId: ticket.id,
      eventId: ticket.eventId,
      buyerId: ticket.buyerId,
    })
    console.log("mensagem enviada para a fila")

    return { ticketId }
  }
}
