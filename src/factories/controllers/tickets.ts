import { BuyTicketController } from "../../controllers/tickets/buy-ticket.js"
import { GetEventByIdRepository } from "../../repositories/events/get-event-by-id.js"
import { BuyTicketRepository } from "../../repositories/ticket/buy-ticket.js"
import { GetUserByIdRepository } from "../../repositories/users/get-user-by-id.js"
import { BuyTicketUseCase } from "../../use-cases/ticket/buy-ticket.js"

export const makeBuyTicketController = () => {
  const buyTicketRepository = new BuyTicketRepository()
  const getUserByIdRepository = new GetUserByIdRepository()
  const getEventByIdRepository = new GetEventByIdRepository()
  const buyTicketUseCase = new BuyTicketUseCase(
    buyTicketRepository,
    getEventByIdRepository,
    getUserByIdRepository
  )
  const buyTicketController = new BuyTicketController(buyTicketUseCase)
  return buyTicketController
}
