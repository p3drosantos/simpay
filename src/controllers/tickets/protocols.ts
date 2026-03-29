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

export type TicketWithEventInfo = {
  ticket: {
    id: string
    quantity: number
    totalPriceInCents: number
    status: string
    createdAt: Date
  }
  event: {
    id: string
    name: string
    date: Date
  } | null
}

export type UserTicketResponse = {
  id: string
  quantity: number
  totalPriceInCents: number
  status: string
  createdAt: Date
  event: {
    id: string
    name: string
    date: Date
  } | null
}

export interface IGetUserTicketsRepository {
  getUserTickets(userId: string): Promise<TicketWithEventInfo[]>
}

export interface IGetUserTicketsUseCase {
  getUserTickets(userId: string): Promise<UserTicketResponse[]>
}

export interface IGetUserTicketsController {
  getUserTickets(
    request: HttpRequest<unknown, unknown, unknown, unknown>
  ): Promise<HttpResponse<UserTicketResponse[] | { error: string }>>
}
