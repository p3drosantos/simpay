import { Router } from "express"
import {
  makeCreateEventController,
  makeGetEventByIdController,
  makeGetAllEventsController,
  makeUpdateEventController,
  makeDeleteEventController,
} from "../factories/controllers/events.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const eventRouter = Router()

eventRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const createEventController = makeCreateEventController()

    const response = await createEventController.createEvent({
      body: req.body,
      userId: req.userId,
    })

    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /events:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

eventRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const getEventByIdController = makeGetEventByIdController()

    const response = await getEventByIdController.getEventById({
      params: req.params as { id: string },
    })

    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /events/:id:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

eventRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const getAllEventsController = makeGetAllEventsController()
    const response = await getAllEventsController.getAllEvents()
    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /events:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

eventRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updateEventController = makeUpdateEventController()

    const response = await updateEventController.updateEvent({
      params: req.params as { id: string },
      body: req.body,
      userId: req.userId,
    })
    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA PUT /events/:id:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

eventRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleteEventController = makeDeleteEventController()

    const response = await deleteEventController.deleteEvent({
      params: req.params as { id: string },
      userId: req.userId,
    })
    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA DELETE /events/:id:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

export default eventRouter
