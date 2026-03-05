import { Event } from "../../models/event.js"
import {
  CreateEventInput,
  UpdateEventInput,
} from "../../validators/create-event.schema.js"
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

export interface IGetAllEventsRepository {
  getAllEvents: () => Promise<Event[]>
}

export interface IGetAllEventsUseCase {
  getAllEvents: () => Promise<Event[]>
}

export interface IGetAllEventsController {
  getAllEvents: (
    request: HttpRequest
  ) => Promise<HttpResponse<Event[] | { error: string }>>
}

export interface IUpdateEventRepository {
  updateEvent: (
    id: string,
    data: Partial<UpdateEventInput>
  ) => Promise<Event | null>
}

export interface IUpdateEventUseCase {
  updateEvent: (
    id: string,
    data: Partial<UpdateEventInput>
  ) => Promise<Event | null>
}

export interface IUpdateEventController {
  updateEvent: (
    request: HttpRequest<Partial<UpdateEventInput>, { id: string }>
  ) => Promise<HttpResponse<Event | { error: ValidationError[] | string }>>
}

export interface IDeleteEventRepository {
  deleteEvent: (id: string) => Promise<Event | null>
}

export interface IDeleteEventUseCase {
  deleteEvent: (id: string) => Promise<Event | null>
}

export interface IDeleteEventController {
  deleteEvent: (
    request: HttpRequest<unknown, { id: string }>
  ) => Promise<HttpResponse<Event | { error: ValidationError[] | string }>>
}
