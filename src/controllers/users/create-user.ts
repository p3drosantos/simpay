import { ZodError } from "zod"
import { User } from "../../models/user.js"
import {
  CreateUserInput,
  createUserSchema,
} from "../../validators/create-user.schema.js"
import { HttpRequest, HttpResponse, ValidationError } from "../protocols.js"
import { ICreateUserController, ICreateUserUseCase } from "./protocols.js"

export class CreateUserController implements ICreateUserController {
  constructor(private createUserUseCase: ICreateUserUseCase) {}

  async createUser(
    request: HttpRequest<CreateUserInput>
  ): Promise<
    HttpResponse<Omit<User, "password"> | { error: ValidationError[] | string }>
  > {
    try {
      if (!request.body) {
        return {
          statusCode: 400,
          body: { error: "Missing body" },
        }
      }

      const parsed = createUserSchema.parse(request.body)

      const user = await this.createUserUseCase.createUser(parsed)

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }

      return {
        statusCode: 201,
        body: userWithoutPassword,
      }
    } catch (error) {
      console.log(error)
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: {
            error: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message:
                issue.code === "invalid_type"
                  ? `${issue.path.join(".")} is required`
                  : issue.message,
            })),
          },
        }
      }
    }

    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    }
  }
}
