import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { IUpdateEventController, IUpdateEventUseCase } from "./protocols.js"
import { Event } from "../../models/event.js"

import {
  UpdateEventInput,
  updateEventSchema,
} from "../../validators/create-event.schema.js"
import { ZodError } from "zod"
import { EventNotFoundError } from "../../errors/users/event.js"
import { UnauthorizedError } from "../../errors/users/user-errors.js"

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

      const allowedFields = ["name", "ticketPriceInCents", "date"]
      const invalidFields = Object.keys(request.body).filter(
        (key) => !allowedFields.includes(key)
      )

      if (invalidFields.length > 0) {
        return {
          statusCode: 400,
          body: {
            error: `Invalid fields: ${invalidFields.join(
              ", "
            )}. Allowed fields are: ${allowedFields.join(", ")}`,
          },
        }
      }

      const parsed = updateEventSchema.parse(request.body)

      const userId = request.userId

      if (!userId) {
        return { statusCode: 401, body: { error: "Unauthorized" } }
      }

      const updatedEvent = await this.updateEventUseCase.updateEvent(
        request.params.id,
        userId,
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

      if (error instanceof EventNotFoundError) {
        return { statusCode: 404, body: { error: error.message } }
      }

      if (error instanceof UnauthorizedError) {
        return { statusCode: 401, body: { error: error.message } }
      }

      return { statusCode: 500, body: { error: "Internal server error" } }
    }
  }
}
