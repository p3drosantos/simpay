import express from "express"
import dotenv from "dotenv"

import eventRouter from "./routes/events.js"
import userRouter from "./routes/users.js"

dotenv.config()

const app = express()
app.use(express.json())

app.use("/events", eventRouter)
app.use("/users", userRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
