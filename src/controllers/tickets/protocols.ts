import { Ticket } from "../../models/ticket.js"
import { BuyTicketParams, CreateTicketParams } from "../../types/ticket.js"
import { BuyTicketsInput } from "../../validators/buy-tickets.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"

export interface IBuyTicketRepository {
  buyTicket(params: CreateTicketParams): Promise<Ticket>
  sumTicketsByEventId(eventId: string): Promise<number>
}

export interface IBuyTicketUseCase {
  buyTicket(params: BuyTicketParams): Promise<Ticket>
}

export interface IBuyTicketController {
  buyTicket(
    request: HttpRequest<BuyTicketsInput, { eventId: string }>
  ): Promise<HttpResponse<Ticket | { error: ValidationError[] | string }>>
}
