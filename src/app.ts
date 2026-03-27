import express from "express"
import dotenv from "dotenv"

import eventRouter from "./routes/events.js"
import userRouter from "./routes/users.js"
import ticketRouter from "./routes/tickets.js"

import fs from "fs"
import path from "path"

import swaggerUi from "swagger-ui-express"
import webhookRouter from "./routes/webhook.js"

dotenv.config()

export const app = express()
app.use("/", webhookRouter)

app.use("/events", express.json(), eventRouter)
app.use("/users", express.json(), userRouter)
app.use("/events", express.json(), ticketRouter)

const swaggerPath = path.join(process.cwd(), "docs", "swagger.json")

const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"))

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
