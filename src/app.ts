import express from "express"
import dotenv from "dotenv"

import eventRouter from "./routes/events.js"
import userRouter from "./routes/users.js"
import ticketRouter from "./routes/tickets.js"

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

import swaggerUi from "swagger-ui-express"

dotenv.config()

export const app = express()

app.use(express.json())

app.use("/events", eventRouter)
app.use("/users", userRouter)
app.use("/tickets", ticketRouter)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerDcocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../docs/swagger.json"), "utf-8")
)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDcocument))
