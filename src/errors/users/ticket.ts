export class OnlyCustomerCanBuyTicketError extends Error {
  constructor() {
    super("Only customer can buy ticket")
  }
}

export class EventAlreadyOccurredError extends Error {
  constructor() {
    super("Event has already occurred")
  }
}

export class EventCapacityExceededError extends Error {
  constructor() {
    super("Event capacity exceeded")
  }
}

export class MissingTicketIdError extends Error {
  constructor() {
    super("Missing ticketId in Stripe session metadata")
    this.name = "MissingTicketIdError"
  }
}
