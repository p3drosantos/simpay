import { UnauthorizedError } from "../../errors/users/user-errors.js"
import { HttpRequest, HttpResponse } from "../protocols.js"
import {
  IGetUserTicketsController,
  IGetUserTicketsUseCase,
  UserTicketResponse,
} from "./protocols.js"

export class GetUserTicketsController implements IGetUserTicketsController {
  constructor(private readonly getUserTicketsUseCase: IGetUserTicketsUseCase) {}
  async getUserTickets(
    request: HttpRequest<unknown, unknown, unknown, unknown>
  ): Promise<HttpResponse<UserTicketResponse[] | { error: string }>> {
    const userId = request.userId

    if (!userId) {
      return {
        statusCode: 401,
        body: { error: "Unauthorized" },
      }
    }

    try {
      const tickets = await this.getUserTicketsUseCase.getUserTickets(userId)
      return {
        statusCode: 200,
        body: tickets,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          body: { error: "Internal server error" },
        }
      }

      if (error instanceof UnauthorizedError) {
        return {
          statusCode: 401,
          body: { error: "Unauthorized" },
        }
      }

      return {
        statusCode: 500,
        body: { error: "Unknown error" },
      }
    }
  }
}
