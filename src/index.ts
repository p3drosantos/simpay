import express from "express"
import dotenv from "dotenv"
import { CreateEventRepository } from "./repositories/create-event.js"
import { CreateEventUseCase } from "./use-cases/create-event.js"
import { CreateEventController } from "./controllers/events/create-event.js"
import { GetEventByIdRepository } from "./repositories/get-event-by-id.js"
import { GetEventByIdUseCase } from "./use-cases/get-event-by-id.js"
import { GetEventByIdController } from "./controllers/events/get-event-by-id.js"
dotenv.config()

const app = express()
app.use(express.json())

app.post("/events", async (req, res) => {
  try {
    const createEventRepository = new CreateEventRepository()
    const createEventUseCase = new CreateEventUseCase(createEventRepository)
    const createEventController = new CreateEventController(createEventUseCase)

    const response = await createEventController.createEvent({
      body: req.body,
    })

    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /events:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

app.get("/events/:id", async (req, res) => {
  try {
    const getEventByIdRepository = new GetEventByIdRepository()
    const getEventByIdUseCase = new GetEventByIdUseCase(getEventByIdRepository)
    const getEventByIdController = new GetEventByIdController(
      getEventByIdUseCase
    )

    const response = await getEventByIdController.getEventById({
      params: req.params,
    })

    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /events/:id:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
