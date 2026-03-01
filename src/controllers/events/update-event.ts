import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { IUpdateEventController, IUpdateEventUseCase } from "./protocols.js"
import { Event } from "../../models/event.js"

import {
  UpdateEventInput,
  updateEventSchema,
} from "../../validators/create-event.schema.js"
import { ZodError } from "zod"

export class UpdateEventController implements IUpdateEventController {
  constructor(private updateEventUseCase: IUpdateEventUseCase) {}

  async updateEvent(
    request: HttpRequest<Partial<UpdateEventInput>, { id: string }>
  ): Promise<HttpResponse<Event | { error: ValidationError[] | string }>> {
    try {
      if (!request.params?.id) {
        return { statusCode: 400, body: { error: "Event ID is required" } }
      }

      if (!request.body || Object.keys(request.body).length === 0) {
        return { statusCode: 400, body: { error: "No fields to update" } }
      }

      const parsed = updateEventSchema.parse(request.body)

      const updatedEvent = await this.updateEventUseCase.updateEvent(
        request.params.id,
        parsed
      )

      if (!updatedEvent) {
        return { statusCode: 404, body: { error: "Event not found" } }
      }

      return { statusCode: 200, body: updatedEvent }
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: {
            error: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message:
                issue.code === "invalid_type"
                  ? `${issue.path.join(".")} is required`
                  : issue.message,
            })),
          },
        }
      }

      return { statusCode: 500, body: { error: "Internal server error" } }
    }
  }
}
