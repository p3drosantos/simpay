import { Event } from "../../models/event.js"
import { CreateEventInput } from "../../validators/create-event.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"

export interface ICreateEventsRepository {
  createEvent: (params: CreateEventInput) => Promise<Event>
}

export interface ICreateEventUseCase {
  createEvent: (params: CreateEventInput) => Promise<Event>
}

export interface ICreateEventController {
  createEvent: (
    request: HttpRequest<CreateEventInput>
  ) => Promise<HttpResponse<Event | { error: ValidationError[] | string }>>
}

export interface IGetEventByIdRepository {
  getEventById: (id: string) => Promise<Event | null>
}

export interface IGetEventByIdUseCase {
  getEventById: (id: string) => Promise<Event | null>
}

export interface IGetEventByIdController {
  getEventById: (
    request: HttpRequest<unknown, { id: string }>
  ) => Promise<HttpResponse<Event | { error: string }>>
}
