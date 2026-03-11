import jwt from "jsonwebtoken"
import { ITokenGenerator } from "../interfaces/token-generator.js"

export class JwtAdapter implements ITokenGenerator {
  generate(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    })
  }
}
