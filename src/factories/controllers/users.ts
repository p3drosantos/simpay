import { BcryptAdapter } from "../../adapters/bcrypt-adapter.js"
import { JwtAdapter } from "../../adapters/jwt-adapter.js"
import { LoginController } from "../../controllers/auth/login.js"
import { CreateUserController } from "../../controllers/users/create-user.js"
import { CreateUserRepository } from "../../repositories/users/create-user.js"
import { GetUserByEmailRepository } from "../../repositories/users/get-user-by-email.js"
import { LoginUseCase } from "../../use-cases/auth/login.js"
import { CreateUserUseCase } from "../../use-cases/users/create-user.js"

export const makeCreateUserController = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository()
  const createUserRepository = new CreateUserRepository()
  const bcryptAdapter = new BcryptAdapter()
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    bcryptAdapter
  )
  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}

export const makeLoginController = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository()
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter()
  const loginUseCase = new LoginUseCase(
    getUserByEmailRepository,
    bcryptAdapter,
    jwtAdapter
  )
  const loginController = new LoginController(loginUseCase)

  return loginController
}
