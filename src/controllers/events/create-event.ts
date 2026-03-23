import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { ICreateEventController, ICreateEventUseCase } from "./protocols.js"
import { Event } from "../../models/event.js"
import {
  CreateEventInput,
  createEventSchema,
} from "../../validators/create-event.schema.js"
import { ZodError } from "zod"
import { UserNotFoundError } from "../../errors/users/user-errors.js"
import {
  EventAlreadyExistsError,
  EventDateIsInThePastError,
} from "../../errors/users/event.js"

export class CreateEventController implements ICreateEventController {
  constructor(private createEventUseCase: ICreateEventUseCase) {}

  async createEvent(
    request: HttpRequest<CreateEventInput>
  ): Promise<HttpResponse<Event | { error: ValidationError[] | string }>> {
    try {
      if (!request.body) {
        return {
          statusCode: 400,
          body: { error: "Missing body" },
        }
      }
      const parsed = createEventSchema.parse(request.body)

      const userId = request.userId

      if (!userId) {
        return {
          statusCode: 401,
          body: { error: "Unauthorized: Missing user ID" },
        }
      }

      const event = await this.createEventUseCase.createEvent({
        ...parsed,
        ownerId: userId,
      })
      return {
        statusCode: 201,
        body: event,
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          statusCode: 404,
          body: { error: error.message },
        }
      }

      if (error instanceof EventAlreadyExistsError) {
        return {
          statusCode: 409,
          body: { error: error.message },
        }
      }

      if (error instanceof EventDateIsInThePastError) {
        return {
          statusCode: 400,
          body: { error: error.message },
        }
      }

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
    }

    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    }
  }
}
