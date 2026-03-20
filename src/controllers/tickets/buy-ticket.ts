import { ZodError } from "zod"
import { EventNotFoundError } from "../../errors/users/event.js"
import {
  EventAlreadyOccurredError,
  EventCapacityExceededError,
  OnlyCustomerCanBuyTicketError,
} from "../../errors/users/ticket.js"
import { UserNotFoundError } from "../../errors/users/user-errors.js"
import { Ticket } from "../../models/ticket.js"
import {
  BuyTicketsInput,
  buyTicketsSchema,
} from "../../validators/buy-tickets.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { IBuyTicketController, IBuyTicketUseCase } from "./protocols.js"

export class BuyTicketController implements IBuyTicketController {
  constructor(private buyTicketUseCase: IBuyTicketUseCase) {}

  async buyTicket(
    request: HttpRequest<BuyTicketsInput, { eventId: string }>
  ): Promise<HttpResponse<Ticket | { error: ValidationError[] | string }>> {
    try {
      if (!request.body) {
        return {
          statusCode: 400,
          body: { error: "Missing body" },
        }
      }

      const parsed = buyTicketsSchema.parse(request.body)

      const eventid = request.params?.eventId

      const buyerId = request.userId

      if (!buyerId) {
        return {
          statusCode: 401,
          body: { error: "Unauthorized: Missing user ID" },
        }
      }

      if (!eventid) {
        return {
          statusCode: 400,
          body: { error: "Missing event ID" },
        }
      }

      const ticketParams = {
        ...parsed,
        eventId: eventid,
        buyerId: buyerId,
      }

      const ticket = await this.buyTicketUseCase.buyTicket(ticketParams)
      return {
        statusCode: 201,
        body: ticket,
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          statusCode: 404,
          body: { error: "User not found" },
        }
      }

      if (error instanceof OnlyCustomerCanBuyTicketError) {
        return {
          statusCode: 403,
          body: { error: "Only customers can buy tickets" },
        }
      }

      if (error instanceof EventNotFoundError) {
        return {
          statusCode: 404,
          body: { error: "Event not found" },
        }
      }

      if (error instanceof EventCapacityExceededError) {
        return {
          statusCode: 400,
          body: { error: "Event capacity exceeded" },
        }
      }

      if (error instanceof EventAlreadyOccurredError) {
        return {
          statusCode: 400,
          body: { error: "Event already occurred" },
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

      if (error instanceof Error) {
        return {
          statusCode: 500,
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
