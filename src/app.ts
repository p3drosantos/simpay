import express from "express"
import dotenv from "dotenv"

import eventRouter from "./routes/events.js"
import userRouter from "./routes/users.js"
import ticketRouter from "./routes/tickets.js"

dotenv.config()

export const app = express()
app.use(express.json())

app.use("/events", eventRouter)
app.use("/users", userRouter)
app.use("/tickets", ticketRouter)
