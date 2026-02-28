import { getEventByIdSchema } from "../../validators/create-event.schema.js"
import { HttpRequest } from "../protocols.js"
import { IGetEventByIdController, IGetEventByIdUseCase } from "./protocols.js"

export class GetEventByIdController implements IGetEventByIdController {
  constructor(private getEventByIdUseCase: IGetEventByIdUseCase) {}

  async getEventById(request: HttpRequest<unknown, { id: string }>) {
    try {
      const parsed = getEventByIdSchema.parse(request.params)

      const event = await this.getEventByIdUseCase.getEventById(parsed.id)

      if (!event) {
        return {
          statusCode: 404,
          body: { error: "Event not found" },
        }
      }

      return {
        statusCode: 200,
        body: event,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 400,
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
