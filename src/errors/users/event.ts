export class EventNotFoundError extends Error {
  constructor() {
    super("Event not found")
    this.name = "EventNotFoundError"
  }
}

export class EventAlreadyExistsError extends Error {
  constructor() {
    super("Event already exists")
    this.name = "EventAlreadyExistsError"
  }
}

export class EventDateIsInThePastError extends Error {
  constructor() {
    super("Date must be in the future")
    this.name = "EventDateIsInThePastError"
  }
}
