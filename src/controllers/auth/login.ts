import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../errors/users/user-errors.js"
import { LoginInput, loginSchema } from "../../validators/login.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { ILoginController, ILoginUseCase, LoginResponse } from "./protocols.js"

export class LoginController implements ILoginController {
  constructor(private loginUseCase: ILoginUseCase) {}

  async login(
    request: HttpRequest<LoginInput>
  ): Promise<
    HttpResponse<LoginResponse | { error: ValidationError[] | string }>
  > {
    try {
      const parsed = loginSchema.parse(request.body)
      const response = await this.loginUseCase.login(parsed)
      return {
        statusCode: 200,
        body: response,
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          statusCode: 404,
          body: { error: "User not found" },
        }
      }
      if (error instanceof InvalidCredentialsError) {
        return {
          statusCode: 401,
          body: { error: "Invalid credentials" },
        }
      }
      if (error instanceof Error) {
        return {
          statusCode: 400,
          body: { error: error.message },
        }
      }
      return {
        statusCode: 500,
        body: { error: "Internal server error" },
      }
    }
  }
}
