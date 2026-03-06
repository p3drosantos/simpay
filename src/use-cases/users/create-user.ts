import {
  ICreateUserRepository,
  ICreateUserUseCase,
} from "../../controllers/users/protocols.js"
import { CreateUserInput } from "../../validators/create-user.schema.js"
import bcrypt from "bcrypt"

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(private createUserRepository: ICreateUserRepository) {}

  async createUser(params: CreateUserInput) {
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
