import { TicketStatus } from "../types/ticket.js"

export interface Ticket {
  id: string
  eventId: string
  buyerId: string
  quantity: number
  totalPriceInCents: number
  status: TicketStatus
  createdAt: Date
}
