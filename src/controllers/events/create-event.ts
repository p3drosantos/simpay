import { HttpRequest, HttpResponse } from "../protocols.js"
import {
  createEventsParams,
  ICreateEventController,
  ICreateEventUseCase,
} from "./protocols.js"
import { Event } from "../../models/event.js"

export class CreateEventController implements ICreateEventController {
  constructor(private createEventUseCase: ICreateEventUseCase) {}

  async createEvent(
    request: HttpRequest<createEventsParams>
  ): Promise<HttpResponse<Event | { error: string }>> {
    try {
      if (!request.body) {
        return {
          statusCode: 400,
          body: { error: "Missing body" },
        }
      }
      const event = await this.createEventUseCase.createEvent({
        ...request.body,
        date: new Date(request.body.date),
      })
      return {
        statusCode: 201,
        body: event,
      }
    } catch (error) {
      console.error("ERRO NO CONTROLLER:")
      console.error(error)

      return {
        statusCode: 500,
        body: { error: String(error) },
      }
    }
  }
}
