import { ZodError } from "zod"
import { deleteEventSchema } from "../../validators/create-event.schema.js"
import { HttpRequest } from "../protocols.js"
import { IDeleteEventController, IDeleteEventUseCase } from "./protocols.js"
import { EventNotFoundError } from "../../errors/users/event.js"
import { UnauthorizedError } from "../../errors/users/user-errors.js"

export class DeleteEventController implements IDeleteEventController {
  constructor(private deleteEventUseCase: IDeleteEventUseCase) {}

  async deleteEvent(request: HttpRequest<unknown, { id: string }>) {
    if (!request.params || !request.params.id) {
      return {
        statusCode: 400,
        body: { error: "Missing event ID in request parameters" },
      }
    }

    const { id } = request.params
    try {
      const parsed = deleteEventSchema.parse({ id })

      const userId = request.userId

      if (!userId) {
        return {
          statusCode: 401,
          body: { error: "Unauthorized: Missing user ID" },
        }
      }

      const deletedEvent = await this.deleteEventUseCase.deleteEvent(
        parsed.id,
        userId
      )

      if (!deletedEvent) {
        return {
          statusCode: 404,
          body: { error: "Event not found" },
        }
      }
      return {
        statusCode: 200,
        body: deletedEvent,
      }
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
        return {
          statusCode: 404,
          body: { error: error.message },
        }
      }

      if (error instanceof UnauthorizedError) {
        return {
          statusCode: 403,
          body: { error: error.message },
        }
      }

      return {
        statusCode: 500,
        body: { error: "Internal server error" },
      }
    }
  }
}
