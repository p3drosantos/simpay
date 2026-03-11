import bcrypt from "bcrypt"
import { IHashCompare, IHashGenerate } from "../interfaces/hash-provider.js"

export class BcryptAdapter implements IHashCompare, IHashGenerate {
  async hash(value: string) {
    return bcrypt.hash(value, 10)
  }

  async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash)
  }
}
