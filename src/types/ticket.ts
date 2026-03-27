export interface BuyTicketParams {
  eventId: string
  buyerId: string
  quantity: number
}

export type TicketStatus = "pending" | "paid" | "canceled"

export type UpdateTicketData = {
  status?: TicketStatus
}

export interface CreateTicketParams {
  eventId: string
  buyerId: string
  quantity: number
  totalPriceInCents: number
  status: TicketStatus
}
