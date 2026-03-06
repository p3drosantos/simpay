import { User } from "../../models/user.js"
import { CreateUserInput } from "../../validators/create-user.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"

export interface ICreateUserRepository {
  createUser: (params: CreateUserInput) => Promise<User>
}

export interface ICreateUserUseCase {
  createUser: (params: CreateUserInput) => Promise<User>
}

export interface ICreateUserController {
  createUser: (
    httpRequest: HttpRequest<CreateUserInput>
  ) => Promise<
    HttpResponse<Omit<User, "password"> | { error: ValidationError[] | string }>
  >
}
