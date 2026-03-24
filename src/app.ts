import express from "express"
import dotenv from "dotenv"

import eventRouter from "./routes/events.js"
import userRouter from "./routes/users.js"
import ticketRouter from "./routes/tickets.js"

import fs from "fs"
import path from "path"

import swaggerUi from "swagger-ui-express"

dotenv.config()

export const app = express()

app.use(express.json())

app.use("/events", eventRouter)
app.use("/users", userRouter)
app.use("/events", ticketRouter)

const swaggerPath = path.join(process.cwd(), "docs", "swagger.json")

const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"))

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
