import {
  ILoginUseCase,
  LoginResponse,
} from "../../controllers/auth/protocols.js"
import { IGetUserByEmailRepository } from "../../controllers/users/protocols.js"
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../errors/users/user-errors.js"
import bcrypt from "bcrypt"
import { LoginInput } from "../../validators/login.schema.js"
import jwt from "jsonwebtoken"

export class LoginUseCase implements ILoginUseCase {
  constructor(private getUserByEmailRepository: IGetUserByEmailRepository) {}

  async login(params: LoginInput): Promise<LoginResponse> {
    const user = await this.getUserByEmailRepository.getUserByEmail(
      params.email
    )
    if (!user) {
      throw new UserNotFoundError()
    }

    const isPasswordValid = await bcrypt.compare(params.password, user.password)
    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
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
