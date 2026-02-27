import { Event } from "../../models/event.js"
import { CreateEventInput } from "../../validators/create-event.schema.js"
import { HttpRequest, HttpResponse } from "../protocols.js"

export interface ICreateEventsRepository {
  createEvent: (params: CreateEventInput) => Promise<Event>
}

export interface ICreateEventUseCase {
  createEvent: (params: CreateEventInput) => Promise<Event>
}

export interface ICreateEventController {
  createEvent: (
    request: HttpRequest<CreateEventInput>
  ) => Promise<HttpResponse<Event | { error: string }>>
}
