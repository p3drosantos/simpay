export class InvalidWebhookEventError extends Error {
  constructor(eventType: string) {
    super(`Unhandled Stripe event type: ${eventType}`)
    this.name = "InvalidWebhookEventError"
  }
}
