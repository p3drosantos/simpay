export interface BuyTicketParams {
  eventId: string
  buyerId: string
  quantity: number
}

export interface CreateTicketParams {
  eventId: string
  buyerId: string
  quantity: number
  totalPriceInCents: number
}
