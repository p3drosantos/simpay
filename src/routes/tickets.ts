import { Router } from "express"
import { makeBuyTicketController } from "../factories/controllers/tickets.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const ticketRouter = Router()

ticketRouter.post("/:id", authMiddleware, async (req, res) => {
  try {
    const buyTicketController = makeBuyTicketController()

    const response = await buyTicketController.buyTicket({
      body: req.body,
      userId: req.userId,
      params: req.params as { id: string },
    })
    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /tickets:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

export default ticketRouter
