import { User } from "../../models/user.js"
import { LoginInput } from "../../validators/login.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"

export type LoginResponse = {
  token: string
  user: Omit<User, "password">
}

export interface ILoginUseCase {
  login(params: LoginInput): Promise<LoginResponse>
}

export interface ILoginController {
  login(
    request: HttpRequest<LoginInput>
  ): Promise<
    HttpResponse<LoginResponse | { error: ValidationError[] | string }>
  >
}
