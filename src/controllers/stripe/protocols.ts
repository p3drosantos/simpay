import { HttpRequest, HttpResponse } from "../protocols.js"
import { Stripe } from "stripe"

export interface IStripeWebhookController {
  updateFromWebhook(
    request: StripeWebhookRequest
  ): Promise<HttpResponse<{ ticketId: string } | { error: string }>>
}

export interface StripeWebhookRequest extends HttpRequest {
  rawBody: Buffer
  stripeSignature?: string
}

export interface IStripeWebhookUseCase {
  updateFromWebhook(event: Stripe.Event): Promise<{ ticketId: string }>
}
