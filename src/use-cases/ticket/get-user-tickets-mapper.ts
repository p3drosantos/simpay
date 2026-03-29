import {
  TicketWithEventInfo,
  UserTicketResponse,
} from "../../controllers/tickets/protocols.js"

export function mapTicketsWithEvent(
  data: TicketWithEventInfo[]
): UserTicketResponse[] {
  return data.map((item) => ({
    id: item.ticket.id,
    quantity: item.ticket.quantity,
    totalPriceInCents: item.ticket.totalPriceInCents,
    status: item.ticket.status,
    createdAt: item.ticket.createdAt,
    event: item.event
      ? {
          id: item.event.id,
          name: item.event.name,
          date: item.event.date,
        }
      : null,
  }))
}
