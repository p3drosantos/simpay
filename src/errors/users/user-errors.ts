export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists")
    this.name = "UserAlreadyExistsError"
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found")
    this.name = "UserNotFoundError"
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials")
    this.name = "InvalidCredentialsError"
  }
}
