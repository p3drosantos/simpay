import { Ticket } from "../../models/ticket.js"
import {
  BuyTicketParams,
  CreateTicketParams,
  UpdateTicketData,
} from "../../types/ticket.js"
import { BuyTicketsInput } from "../../validators/buy-tickets.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"

export interface IBuyTicketRepository {
  buyTicket(params: CreateTicketParams): Promise<Ticket>
  sumTicketsByEventId(eventId: string): Promise<number>
  updateTicket(ticketId: string, data: UpdateTicketData): Promise<Ticket>
}

export interface IBuyTicketUseCase {
  buyTicket(
    params: BuyTicketParams
  ): Promise<{ checkoutUrl: string; ticketId: string }>
}

export interface IBuyTicketController {
  buyTicket(
    request: HttpRequest<BuyTicketsInput, { eventId: string }>
  ): Promise<
    HttpResponse<
      | { checkoutUrl: string; ticketId: string }
      | { error: ValidationError[] | string }
    >
  >
}
