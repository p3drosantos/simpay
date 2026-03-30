import { Router } from "express"
import {
  makeCreateUserController,
  makeLoginController,
} from "../factories/controllers/users.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { makeGetUserTicketsController } from "../factories/controllers/users.js"

const userRouter = Router()

userRouter.post("/", async (req, res) => {
  try {
    const createUserController = makeCreateUserController()

    const response = await createUserController.createUser({
      body: req.body,
    })

    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /users:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

userRouter.post("/login", async (req, res) => {
  try {
    const loginController = makeLoginController()

    const response = await loginController.login({
      body: req.body,
    })

    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /login:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

userRouter.get("/me/tickets", authMiddleware, async (req, res) => {
  try {
    const getUserTicketsController = makeGetUserTicketsController()

    const response = await getUserTicketsController.getUserTickets({
      userId: req.userId,
    })
    return res.status(response.statusCode).json(response.body)
  } catch (error) {
    console.error("ERRO NA ROTA /users/me/tickets:")
    console.error(error)

    return res.status(500).json({ error: String(error) })
  }
})

export default userRouter
