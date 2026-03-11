import {
  ILoginUseCase,
  LoginResponse,
} from "../../controllers/auth/protocols.js"
import { IGetUserByEmailRepository } from "../../controllers/users/protocols.js"
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../errors/users/user-errors.js"
import { LoginInput } from "../../validators/login.schema.js"
import { IHashCompare } from "../../interfaces/hash-provider.js"
import { ITokenGenerator } from "../../interfaces/token-generator.js"

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private hashCompare: IHashCompare,
    private tokenGenerator: ITokenGenerator
  ) {}

  async login(params: LoginInput): Promise<LoginResponse> {
    const user = await this.getUserByEmailRepository.getUserByEmail(
      params.email
    )
    if (!user) {
      throw new UserNotFoundError()
    }

    const isPasswordValid = await this.hashCompare.compare(
      params.password,
      user.password
    )
    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    const token = this.tokenGenerator.generate({
      userId: user.id,
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }
  }
}
