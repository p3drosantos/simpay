import express from "express"
import dotenv from "dotenv"
import { CreateEventRepository } from "./repositories/create-event.js"
import { CreateEventUseCase } from "./use-cases/create-event.js"
import { CreateEventController } from "./controllers/events/create-event.js"
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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
