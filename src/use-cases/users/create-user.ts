import {
  ICreateUserRepository,
  ICreateUserUseCase,
  IGetUserByEmailRepository,
} from "../../controllers/users/protocols.js"
import { UserAlreadyExistsError } from "../../errors/users/user-errors.js"
import { IHashGenerate } from "../../interfaces/hash-provider.js"
import { CreateUserInput } from "../../validators/create-user.schema.js"

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private hashGenerate: IHashGenerate
  ) {}

  async createUser(params: CreateUserInput) {
    const userAlreadyExists =
      await this.getUserByEmailRepository.getUserByEmail(params.email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await this.hashGenerate.hash(params.password)

    const userParams: CreateUserInput = {
      name: params.name,
      email: params.email,
      password: hashedPassword,
      role: params.role,
    }

    const user = await this.createUserRepository.createUser(userParams)

    return user
  }
}
