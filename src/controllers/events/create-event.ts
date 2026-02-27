import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { ICreateEventController, ICreateEventUseCase } from "./protocols.js"
import { Event } from "../../models/event.js"
import {
  CreateEventInput,
  createEventSchema,
} from "../../validators/create-event.schema.js"
import { ZodError } from "zod"

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

      const event = await this.createEventUseCase.createEvent({
        ...parsed,
      })
      return {
        statusCode: 201,
        body: event,
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
    }

    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    }
  }
}
