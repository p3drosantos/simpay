export interface Ticket {
  id: string
  eventId: string
  buyerId: string
  quantity: number
  totalPriceInCents: number
  createdAt: Date
}
