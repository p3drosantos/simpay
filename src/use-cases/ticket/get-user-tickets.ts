import {
  IGetUserTicketsRepository,
  IGetUserTicketsUseCase,
  UserTicketResponse,
} from "../../controllers/tickets/protocols.js"
import { UnauthorizedError } from "../../errors/users/user-errors.js"

import { mapTicketsWithEvent } from "./get-user-tickets-mapper.js"

export class GetUserTicketsUseCase implements IGetUserTicketsUseCase {
  constructor(
    private readonly getUserTicketRepository: IGetUserTicketsRepository
  ) {}
  async getUserTickets(userId: string): Promise<UserTicketResponse[]> {
    if (!userId) {
      throw new UnauthorizedError()
    }

    const tickets = await this.getUserTicketRepository.getUserTickets(userId)

    if (!tickets) return []

    return mapTicketsWithEvent(tickets)
  }
}
