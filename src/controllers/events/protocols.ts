import { Event } from "../../models/event.js"
import { HttpRequest, HttpResponse } from "../protocols.js"

export interface createEventsParams {
  id: string
  ownerId: string
  name: string
  ticketPriceInCents: number
  longitude: number
  latitude: number
  date: Date
}

export interface ICreateEventsRepository {
  createEvent: (params: createEventsParams) => Promise<Event>
}

export interface ICreateEventUseCase {
  createEvent: (params: createEventsParams) => Promise<Event>
}

export interface ICreateEventController {
  createEvent: (
    request: HttpRequest<createEventsParams>
  ) => Promise<HttpResponse<Event | { error: string }>>
}
