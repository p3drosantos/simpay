export interface Event {
  id: string
  ownerId: string
  name: string
  ticketPriceInCents: number
  maxTickets: number
  longitude: number
  latitude: number
  date: Date
}
