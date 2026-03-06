import {
  ICreateUserRepository,
  ICreateUserUseCase,
  IGetUserByEmailRepository,
} from "../../controllers/users/protocols.js"
import { UserAlreadyExistsError } from "../../errors/users/user-errors.js"
import { CreateUserInput } from "../../validators/create-user.schema.js"
import bcrypt from "bcrypt"

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository
  ) {}

  async createUser(params: CreateUserInput) {
    const userAlreadyExists =
      await this.getUserByEmailRepository.getUserByEmail(params.email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await bcrypt.hash(params.password, 10)

    const userParams: CreateUserInput = {
      name: params.name,
      email: params.email,
      password: hashedPassword,
    }

    const user = await this.createUserRepository.createUser(userParams)

    return user
  }
}
